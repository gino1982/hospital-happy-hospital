import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { endOfDay, format, startOfDay } from "date-fns";

const slotSchema = z.object({
  active: z.boolean(),
  max: z.number().int().min(1).max(200),
  start: z.string().min(1),
  end: z.string().min(1),
});

const replaceSchema = z.object({
  doctorId: z.string().min(1),
  dateISO: z.string().min(1),
  slots: z.object({
    Morning: slotSchema,
    Afternoon: slotSchema,
    Evening: slotSchema,
  }),
});

export async function PUT(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = replaceSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "INVALID_BODY" }, { status: 400 });
  }

  const { doctorId, dateISO, slots } = parsed.data;
  const date = new Date(dateISO.includes("T") ? dateISO : `${dateISO}T00:00:00`);
  if (Number.isNaN(date.getTime())) {
    return NextResponse.json({ error: "INVALID_DATE" }, { status: 400 });
  }

  const dayStart = startOfDay(date);
  const dayEnd = endOfDay(date);

  const existing = await prisma.schedule.findMany({
    where: {
      doctorId,
      date: { gte: dayStart, lte: dayEnd },
    },
    include: {
      appointments: {
        where: { status: { not: "Cancelled" } },
        select: { id: true },
      },
    },
  });

  const hasActiveAppointments = existing.some((s) => s.appointments.length > 0);
  if (hasActiveAppointments) {
    return NextResponse.json(
      { error: "HAS_ACTIVE_APPOINTMENTS" },
      { status: 409 }
    );
  }

  await prisma.schedule.deleteMany({
    where: {
      doctorId,
      date: { gte: dayStart, lte: dayEnd },
    },
  });

  const scheduleCreates = (Object.entries(slots) as Array<
    ["Morning" | "Afternoon" | "Evening", z.infer<typeof slotSchema>]
  >)
    .filter(([, v]) => v.active)
    .map(([timeSlot, v]) => ({
      id: `${doctorId}-${format(dayStart, "yyyyMMdd")}-${timeSlot}`,
      doctorId,
      date: dayStart,
      timeSlot,
      startTime: v.start,
      endTime: v.end,
      maxPatients: v.max,
      isAvailable: true,
    }));

  if (scheduleCreates.length > 0) {
    await prisma.schedule.createMany({ data: scheduleCreates });
  }

  return NextResponse.json({ ok: true });
}

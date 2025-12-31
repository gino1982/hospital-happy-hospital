import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";

const rescheduleSchema = z.object({
  idNumber: z.string().min(1),
  phone: z.string().min(1),
  newScheduleId: z.string().min(1),
});

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;

  const body = await req.json().catch(() => null);
  const parsed = rescheduleSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "INVALID_BODY" }, { status: 400 });
  }

  const { idNumber, phone, newScheduleId } = parsed.data;

  try {
    const result = await prisma.$transaction(async (tx) => {
      const appt = await tx.appointment.findUnique({
        where: { id },
        select: {
          id: true,
          patientIdNumber: true,
          phone: true,
          status: true,
          scheduleId: true,
        },
      });

      if (!appt) return { error: "NOT_FOUND" as const, status: 404 };
      if (appt.patientIdNumber !== idNumber || appt.phone !== phone) {
        return { error: "FORBIDDEN" as const, status: 403 };
      }

      const schedule = await tx.schedule.findUnique({
        where: { id: newScheduleId },
        select: { id: true, maxPatients: true, isAvailable: true },
      });

      if (!schedule || !schedule.isAvailable) {
        return { error: "SCHEDULE_NOT_FOUND" as const, status: 404 };
      }

      const existingCount = await tx.appointment.count({
        where: {
          scheduleId: newScheduleId,
          status: { not: "Cancelled" },
        },
      });

      if (existingCount >= schedule.maxPatients) {
        return { error: "SCHEDULE_FULL" as const, status: 409 };
      }

      const last = await tx.appointment.findFirst({
        where: { scheduleId: newScheduleId },
        orderBy: { queueNumber: "desc" },
        select: { queueNumber: true },
      });

      const nextQueueNumber = (last?.queueNumber ?? 0) + 1;

      const updated = await tx.appointment.update({
        where: { id },
        data: {
          scheduleId: newScheduleId,
          queueNumber: nextQueueNumber,
          status: "Confirmed",
        },
        select: {
          id: true,
          scheduleId: true,
          queueNumber: true,
          status: true,
          updatedAt: true,
        },
      });

      return { updated };
    });

    if ("error" in result) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }

    return NextResponse.json({ appointment: result.updated });
  } catch (e: any) {
    if (typeof e?.code === "string" && e.code === "P2002") {
      return NextResponse.json({ error: "DUPLICATE_APPOINTMENT" }, { status: 409 });
    }
    return NextResponse.json({ error: "UNKNOWN_ERROR" }, { status: 500 });
  }
}

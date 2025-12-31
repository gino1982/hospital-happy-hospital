import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";

const createAppointmentSchema = z.object({
  scheduleId: z.string().min(1),
  patient: z.object({
    name: z.string().min(1),
    idNumber: z.string().min(1),
    birthDate: z.string().min(1),
    phone: z.string().min(1),
    email: z.string().email().optional().or(z.literal("")),
  }),
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = createAppointmentSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "INVALID_BODY" }, { status: 400 });
  }

  const { scheduleId, patient } = parsed.data;

  try {
    const result = await prisma.$transaction(async (tx) => {
      const schedule = await tx.schedule.findUnique({
        where: { id: scheduleId },
        select: { id: true, maxPatients: true, isAvailable: true },
      });

      if (!schedule || !schedule.isAvailable) {
        return { error: "SCHEDULE_NOT_FOUND" as const, status: 404 };
      }

      const existingCount = await tx.appointment.count({
        where: { scheduleId, status: { not: "Cancelled" } },
      });

      if (existingCount >= schedule.maxPatients) {
        return { error: "SCHEDULE_FULL" as const, status: 409 };
      }

      const last = await tx.appointment.findFirst({
        where: { scheduleId },
        orderBy: { queueNumber: "desc" },
        select: { queueNumber: true },
      });

      const nextQueueNumber = (last?.queueNumber ?? 0) + 1;

      const appointment = await tx.appointment.create({
        data: {
          scheduleId,
          patientName: patient.name,
          patientIdNumber: patient.idNumber,
          birthDate: patient.birthDate,
          phone: patient.phone,
          email: patient.email || undefined,
          queueNumber: nextQueueNumber,
          status: "Confirmed",
        },
        select: {
          id: true,
          scheduleId: true,
          patientName: true,
          patientIdNumber: true,
          birthDate: true,
          phone: true,
          email: true,
          queueNumber: true,
          status: true,
          createdAt: true,
        },
      });

      return { appointment };
    });

    if ("error" in result) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }

    return NextResponse.json({ appointment: result.appointment });
  } catch (e: any) {
    if (typeof e?.code === "string" && e.code === "P2002") {
      return NextResponse.json({ error: "DUPLICATE_APPOINTMENT" }, { status: 409 });
    }
    return NextResponse.json({ error: "UNKNOWN_ERROR" }, { status: 500 });
  }
}

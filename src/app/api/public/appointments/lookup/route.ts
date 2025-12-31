import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";

const lookupSchema = z.object({
  idNumber: z.string().min(1),
  phone: z.string().min(1),
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = lookupSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "INVALID_BODY" }, { status: 400 });
  }

  const { idNumber, phone } = parsed.data;

  const appointments = await prisma.appointment.findMany({
    where: {
      patientIdNumber: idNumber,
      phone,
    },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      scheduleId: true,
      queueNumber: true,
      status: true,
      createdAt: true,
      schedule: {
        select: {
          date: true,
          timeSlot: true,
          startTime: true,
          endTime: true,
          doctor: {
            select: {
              id: true,
              name: true,
              title: true,
              departmentId: true,
            },
          },
        },
      },
    },
  });

  return NextResponse.json({ appointments });
}

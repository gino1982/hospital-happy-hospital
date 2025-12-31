import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { endOfWeek, startOfWeek, startOfMonth, endOfMonth } from "date-fns";

export async function GET() {
  const now = new Date();

  const [doctorsCount, schedulesThisWeek, appointmentsThisMonth] = await Promise.all([
    prisma.doctor.count(),
    prisma.schedule.count({
      where: {
        date: {
          gte: startOfWeek(now, { weekStartsOn: 1 }),
          lte: endOfWeek(now, { weekStartsOn: 1 }),
        },
      },
    }),
    prisma.appointment.count({
      where: {
        createdAt: {
          gte: startOfMonth(now),
          lte: endOfMonth(now),
        },
        status: { not: "Cancelled" },
      },
    }),
  ]);

  return NextResponse.json({
    doctorsCount,
    schedulesThisWeek,
    appointmentsThisMonth,
    satisfaction: 4.9,
  });
}

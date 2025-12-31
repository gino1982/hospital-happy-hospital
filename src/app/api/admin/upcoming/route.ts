import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const now = new Date();

  const schedules = await prisma.schedule.findMany({
    where: { date: { gte: now } },
    orderBy: [{ date: "asc" }, { timeSlot: "asc" }],
    take: 5,
    select: {
      id: true,
      date: true,
      timeSlot: true,
      startTime: true,
      endTime: true,
      maxPatients: true,
      doctor: {
        select: {
          id: true,
          name: true,
          imageUrl: true,
        },
      },
    },
  });

  const counts = await prisma.appointment.groupBy({
    by: ["scheduleId"],
    where: {
      scheduleId: { in: schedules.map((s) => s.id) },
      status: { not: "Cancelled" },
    },
    _count: { _all: true },
  });

  const countMap = new Map(counts.map((c) => [c.scheduleId, c._count._all]));

  return NextResponse.json({
    schedules: schedules.map((s) => ({
      id: s.id,
      date: s.date,
      timeSlot: s.timeSlot,
      startTime: s.startTime,
      endTime: s.endTime,
      maxPatients: s.maxPatients,
      currentPatients: countMap.get(s.id) ?? 0,
      doctor: s.doctor,
    })),
  });
}

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const doctorId = url.searchParams.get("doctorId");

  if (!doctorId) {
    return NextResponse.json({ error: "doctorId is required" }, { status: 400 });
  }

  const from = new Date();

  const schedules = await prisma.schedule.findMany({
    where: {
      doctorId,
      date: { gte: from },
      isAvailable: true,
    },
    orderBy: [{ date: "asc" }, { timeSlot: "asc" }],
    select: {
      id: true,
      doctorId: true,
      date: true,
      timeSlot: true,
      startTime: true,
      endTime: true,
      maxPatients: true,
      isAvailable: true,
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
      ...s,
      currentPatients: countMap.get(s.id) ?? 0,
    })),
  });
}

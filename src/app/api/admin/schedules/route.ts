import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const doctorId = url.searchParams.get("doctorId");
  const fromParam = url.searchParams.get("from");
  const toParam = url.searchParams.get("to");

  if (!doctorId) {
    return NextResponse.json({ error: "doctorId is required" }, { status: 400 });
  }

  const where: any = { doctorId };
  if (fromParam || toParam) {
    where.date = {
      ...(fromParam ? { gte: new Date(fromParam) } : {}),
      ...(toParam ? { lte: new Date(toParam) } : {}),
    };
  }

  const schedules = await prisma.schedule.findMany({
    where,
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

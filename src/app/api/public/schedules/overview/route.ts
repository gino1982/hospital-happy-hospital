import { NextResponse } from "next/server";

import { prisma } from "@/lib/db";

function parseDateParam(value: string | null): Date | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date;
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);

    const fromParam = parseDateParam(url.searchParams.get("from"));
    const toParam = parseDateParam(url.searchParams.get("to"));
    const departmentId = url.searchParams.get("departmentId");

    const from = fromParam ?? new Date();
    const to = toParam ?? new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);

    if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime())) {
      return NextResponse.json({ error: "INVALID_DATE" }, { status: 400 });
    }

    if (to.getTime() < from.getTime()) {
      return NextResponse.json({ error: "INVALID_RANGE" }, { status: 400 });
    }

    const schedules = await prisma.schedule.findMany({
      where: {
        isAvailable: true,
        date: { gte: from, lte: to },
        ...(departmentId
          ? {
              doctor: {
                departmentId,
              },
            }
          : {}),
      },
      orderBy: [{ date: "asc" }, { timeSlot: "asc" }, { startTime: "asc" }],
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
            title: true,
            departmentId: true,
            department: {
              select: { id: true, name: true },
            },
          },
        },
        _count: {
          select: {
            appointments: {
              where: {
                status: { not: "Cancelled" },
              },
            },
          },
        },
      },
    });

    return NextResponse.json(
      schedules.map((s) => ({
        id: s.id,
        date: s.date.toISOString(),
        timeSlot: s.timeSlot,
        startTime: s.startTime,
        endTime: s.endTime,
        maxPatients: s.maxPatients,
        currentPatients: s._count.appointments,
        doctor: s.doctor,
      }))
    );
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "INTERNAL_ERROR" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";

const cancelSchema = z.object({
  idNumber: z.string().min(1),
  phone: z.string().min(1),
});

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;

  const body = await req.json().catch(() => null);
  const parsed = cancelSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "INVALID_BODY" }, { status: 400 });
  }

  const appt = await prisma.appointment.findUnique({
    where: { id },
    select: { id: true, patientIdNumber: true, phone: true, status: true },
  });

  if (!appt) return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });

  if (appt.patientIdNumber !== parsed.data.idNumber || appt.phone !== parsed.data.phone) {
    return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
  }

  if (appt.status === "Cancelled") {
    return NextResponse.json({ ok: true });
  }

  await prisma.appointment.update({
    where: { id },
    data: { status: "Cancelled" },
  });

  return NextResponse.json({ ok: true });
}

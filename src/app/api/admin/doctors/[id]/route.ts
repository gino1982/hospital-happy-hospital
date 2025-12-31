import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";

const updateDoctorSchema = z.object({
  name: z.string().min(1).optional(),
  departmentId: z.string().min(1).optional(),
  title: z.string().min(1).optional(),
  introduction: z.string().optional(),
  imageUrl: z.string().min(1).optional(),
  specialties: z.array(z.string()).optional(),
  isAvailable: z.boolean().optional(),
});

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const body = await req.json().catch(() => null);
  const parsed = updateDoctorSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "INVALID_BODY" }, { status: 400 });
  }

  const doctor = await prisma.doctor.update({
    where: { id },
    data: {
      ...parsed.data,
      ...(parsed.data.specialties ? { specialties: parsed.data.specialties } : {}),
    },
  });

  return NextResponse.json({
    doctor: { ...doctor, specialties: Array.isArray(doctor.specialties) ? doctor.specialties : [] },
  });
}

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  await prisma.doctor.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}

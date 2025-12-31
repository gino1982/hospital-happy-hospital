import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";

export async function GET() {
  const doctors = await prisma.doctor.findMany({
    orderBy: { name: "asc" },
  });

  return NextResponse.json({
    doctors: doctors.map((d) => ({
      ...d,
      specialties: Array.isArray(d.specialties) ? d.specialties : [],
    })),
  });
}

const createDoctorSchema = z.object({
  id: z.string().min(1).optional(),
  name: z.string().min(1),
  departmentId: z.string().min(1),
  title: z.string().min(1).default("主治醫師"),
  introduction: z.string().default(""),
  imageUrl: z.string().min(1),
  specialties: z.array(z.string()).default([]),
  isAvailable: z.boolean().optional().default(true),
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = createDoctorSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "INVALID_BODY" }, { status: 400 });
  }

  const data = parsed.data;
  const id = data.id || `doc-${Date.now()}`;

  const doctor = await prisma.doctor.create({
    data: {
      id,
      name: data.name,
      departmentId: data.departmentId,
      title: data.title,
      introduction: data.introduction,
      imageUrl: data.imageUrl,
      specialties: data.specialties,
      isAvailable: data.isAvailable,
    },
  });

  return NextResponse.json({
    doctor: { ...doctor, specialties: Array.isArray(doctor.specialties) ? doctor.specialties : [] },
  });
}

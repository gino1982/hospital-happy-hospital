import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// 快取設定：1 小時重新驗證
export const revalidate = 3600;

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const departmentId = url.searchParams.get("dept");
    const q = (url.searchParams.get("q") || "").trim();

    const doctors = await prisma.doctor.findMany({
      where: {
        ...(departmentId && departmentId !== "all" ? { departmentId } : {}),
        ...(q
          ? {
              OR: [
                { name: { contains: q } },
                { title: { contains: q } },
                { introduction: { contains: q } },
              ],
            }
          : {}),
      },
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        title: true,
        introduction: true,
        imageUrl: true,
        isAvailable: true,
        specialties: true,
        departmentId: true,
      },
    });

    return NextResponse.json(
      {
        doctors: doctors.map((d) => ({
          ...d,
          specialties: Array.isArray(d.specialties) ? d.specialties : [],
        })),
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        },
      }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch doctors" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// 快取設定：1 小時重新驗證
export const revalidate = 3600;

export async function GET() {
  try {
    const departments = await prisma.department.findMany({
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        description: true,
        icon: true,
      },
    });

    return NextResponse.json(
      { departments },
      {
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        },
      }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch departments" },
      { status: 500 }
    );
  }
}

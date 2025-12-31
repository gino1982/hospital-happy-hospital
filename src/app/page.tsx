"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import { HeroSection } from "@/components/sections/HeroSection";
import { QuickInfoCards } from "@/components/sections/QuickInfoCards";
import { 
    DepartmentsSkeleton, 
    DoctorsSkeleton, 
    CTASkeleton 
} from "@/components/sections/SectionSkeleton";

// 動態導入非首屏的重型元件 - 減少初始 JS bundle 大小
const DepartmentsSection = dynamic(
    () => import("@/components/sections/DepartmentsSection").then(mod => ({ default: mod.DepartmentsSection })),
    {
        loading: () => <DepartmentsSkeleton />,
        ssr: true,
    }
);

const DoctorsSection = dynamic(
    () => import("@/components/sections/DoctorsSection").then(mod => ({ default: mod.DoctorsSection })),
    {
        loading: () => <DoctorsSkeleton />,
        ssr: true,
    }
);

const CTASection = dynamic(
    () => import("@/components/sections/CTASection").then(mod => ({ default: mod.CTASection })),
    {
        loading: () => <CTASkeleton />,
        ssr: true,
    }
);

export default function Home() {
    return (
        <div className="flex flex-col min-h-screen bg-slate-50">
            {/* 首屏元件 - 立即載入，確保 LCP 最佳化 */}
            <HeroSection />
            <QuickInfoCards />

            {/* 非首屏內容 - 動態載入，搭配 Suspense 顯示載入狀態 */}
            <Suspense fallback={<DepartmentsSkeleton />}>
                <DepartmentsSection />
            </Suspense>

            <Suspense fallback={<DoctorsSkeleton />}>
                <DoctorsSection />
            </Suspense>

            <Suspense fallback={<CTASkeleton />}>
                <CTASection />
            </Suspense>
        </div>
    );
}

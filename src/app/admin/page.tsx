"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar, Activity, TrendingUp } from "lucide-react";

export default function AdminDashboard() {
    const [statsData, setStatsData] = useState<{
        doctorsCount: number;
        schedulesThisWeek: number;
        appointmentsThisMonth: number;
        satisfaction: number;
    } | null>(null);

    const [upcoming, setUpcoming] = useState<any[]>([]);

    useEffect(() => {
        const run = async () => {
            const [statsRes, upcomingRes] = await Promise.all([
                fetch("/api/admin/stats", { cache: "no-store" }),
                fetch("/api/admin/upcoming", { cache: "no-store" }),
            ]);

            if (statsRes.ok) setStatsData(await statsRes.json());
            if (upcomingRes.ok) {
                const data = await upcomingRes.json();
                setUpcoming(data.schedules ?? []);
            }
        };
        void run();
    }, []);

    const stats = [
        {
            title: "總醫師數",
            value: statsData?.doctorsCount ?? "-",
            icon: Users,
            description: "目前在職醫師總數 (Active)"
        },
        {
            title: "本週門診",
            value: statsData?.schedulesThisWeek ?? "-",
            icon: Calendar,
            description: "已安排的門診時段",
            trend: "+12%"
        },
        {
            title: "預約總數",
            value: statsData?.appointmentsThisMonth ?? "-",
            icon: Activity,
            description: "本月累計掛號人數",
            trend: "+5%"
        },
        {
            title: "看診滿意度",
            value: statsData?.satisfaction?.toFixed?.(1) ?? "-",
            icon: TrendingUp,
            description: "平均病患評分",
            trend: "+0.2"
        }
    ];

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-slate-900">儀表板 (Dashboard)</h2>
                <p className="text-slate-500 mt-2">歡迎回來，系統管理員。這裡是目前的營運概況。</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat, index) => (
                    <Card key={index} className="border-none shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-slate-500">
                                {stat.title}
                            </CardTitle>
                            <stat.icon className="h-4 w-4 text-primary" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                            <p className="text-xs text-slate-500 mt-1">
                                {stat.description}
                                {stat.trend && <span className="text-emerald-600 font-medium ml-2">{stat.trend}</span>}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Recent Activity / Charts Placeholder */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4 border-none shadow-sm">
                    <CardHeader>
                        <CardTitle>近期掛號趨勢</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <div className="h-[300px] flex items-center justify-center text-slate-400 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                            (Chart Placeholder)
                        </div>
                    </CardContent>
                </Card>
                <Card className="col-span-3 border-none shadow-sm">
                    <CardHeader>
                        <CardTitle>即將開始的門診</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {upcoming.map((schedule) => {
                                const doctor = schedule.doctor;
                                return (
                                    <div key={schedule.id} className="flex items-center">
                                        <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center mr-3 overflow-hidden">
                                            {doctor?.imageUrl ? <img src={doctor.imageUrl} alt="" className="w-full h-full object-cover" /> : <Users className="w-4 h-4" />}
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium leading-none">{doctor?.name} 醫師</p>
                                            <p className="text-xs text-slate-500">{new Date(schedule.date).toLocaleDateString()} {schedule.timeSlot}</p>
                                        </div>
                                        <div className="ml-auto font-medium text-sm text-slate-600">
                                            {schedule.currentPatients}/{schedule.maxPatients}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

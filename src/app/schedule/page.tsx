"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, AlertCircle, ChevronLeft, ChevronRight, Stethoscope, Baby, Heart, Activity } from "lucide-react";
import { addDays, format, startOfWeek } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Dept = { id: string; name: string };

type OverviewSchedule = {
    id: string;
    date: string;
    timeSlot: "Morning" | "Afternoon" | "Evening";
    startTime: string;
    endTime: string;
    maxPatients: number;
    currentPatients: number;
    doctor: {
        id: string;
        name: string;
        title: string;
        departmentId: string;
        department: { id: string; name: string };
    };
};

type TimeSlotKey = "morning" | "afternoon" | "evening";

const dayLabels = ["週一", "週二", "週三", "週四", "週五", "週六"];

const timeSlots: { id: TimeSlotKey; api: OverviewSchedule["timeSlot"]; label: string; time: string }[] = [
    { id: "morning", api: "Morning", label: "早診", time: "09:00 - 12:00" },
    { id: "afternoon", api: "Afternoon", label: "午診", time: "14:00 - 17:00" },
    { id: "evening", api: "Evening", label: "晚診", time: "18:00 - 21:00" },
];

function getDeptIcon(deptId: string) {
    switch (deptId) {
        case "internal":
            return Stethoscope;
        case "surgery":
            return Heart;
        case "pediatrics":
            return Baby;
        case "obgyn":
            return Activity;
        default:
            return Activity;
    }
}

export default function SchedulePage() {
    const [activeDept, setActiveDept] = useState<string>("all");
    const [weekStart, setWeekStart] = useState<Date>(() => startOfWeek(new Date(), { weekStartsOn: 1 }));

    const [departments, setDepartments] = useState<Dept[]>([]);
    const [schedules, setSchedules] = useState<OverviewSchedule[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const days = useMemo(() => {
        return Array.from({ length: 6 }).map((_, i) => {
            const date = addDays(weekStart, i);
            return {
                date,
                key: format(date, "yyyy-MM-dd"),
                label: dayLabels[i],
                short: format(date, "MM/dd"),
            };
        });
    }, [weekStart]);

    useEffect(() => {
        let cancelled = false;

        (async () => {
            try {
                const res = await fetch("/api/public/departments", { cache: "no-store" });
                if (!res.ok) throw new Error("DEPARTMENTS_FETCH_FAILED");
                const json = (await res.json()) as { departments: Array<{ id: string; name: string }> };
                if (!cancelled) setDepartments(json.departments ?? []);
            } catch {
                if (!cancelled) setDepartments([]);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, []);

    useEffect(() => {
        let cancelled = false;
        const from = format(weekStart, "yyyy-MM-dd");
        const to = format(addDays(weekStart, 5), "yyyy-MM-dd");

        (async () => {
            try {
                setLoading(true);
                setError(null);
                const params = new URLSearchParams({ from, to });
                if (activeDept !== "all") params.set("departmentId", activeDept);
                const res = await fetch(`/api/public/schedules/overview?${params.toString()}`, { cache: "no-store" });
                if (!res.ok) throw new Error("SCHEDULES_FETCH_FAILED");
                const json = (await res.json()) as OverviewSchedule[];
                if (!cancelled) setSchedules(Array.isArray(json) ? json : []);
            } catch {
                if (!cancelled) {
                    setSchedules([]);
                    setError("門診資料載入失敗，請稍後再試。");
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [activeDept, weekStart]);

    const scheduleMap = useMemo(() => {
        const map: Record<string, Record<TimeSlotKey, OverviewSchedule[]>> = {};
        for (const d of days) {
            map[d.key] = { morning: [], afternoon: [], evening: [] };
        }

        for (const s of schedules) {
            const dayKey = format(new Date(s.date), "yyyy-MM-dd");
            if (!map[dayKey]) continue;
            if (s.timeSlot === "Morning") map[dayKey].morning.push(s);
            if (s.timeSlot === "Afternoon") map[dayKey].afternoon.push(s);
            if (s.timeSlot === "Evening") map[dayKey].evening.push(s);
        }

        return map;
    }, [days, schedules]);

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            {/* Hero Section */}
            <section className="relative py-20 overflow-hidden bg-emerald-900">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-950 to-emerald-900/90"></div>

                <div className="container relative z-10 px-6 mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <Badge className="bg-emerald-500/20 text-emerald-100 border-emerald-500/30 mb-4 px-4 py-1.5 backdrop-blur-sm">
                            Outpatient Schedule
                        </Badge>
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
                            門診時刻表
                        </h1>
                        <p className="text-emerald-100 text-lg opacity-90 max-w-2xl mx-auto font-light">
                            查詢各科醫師門診時間，為您的健康做最好的安排。
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-12 px-4 md:px-6 -mt-8 relative z-20">
                <div className="container mx-auto max-w-6xl">

                    {/* Controls & Download */}
                    <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-6 mb-8 border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">

                        {/* Department Tabs */}
                        <div className="flex flex-wrap gap-2 justify-center md:justify-start w-full md:w-auto">
                            {[{ id: "all", name: "全部科別" }, ...departments].map((dept) => {
                                const Icon = dept.id === "all" ? Activity : getDeptIcon(dept.id);
                                const isActive = activeDept === dept.id;
                                return (
                                    <button
                                        key={dept.id}
                                        onClick={() => setActiveDept(dept.id)}
                                        className={cn(
                                            "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 border",
                                            isActive
                                                ? "bg-emerald-600 text-white border-emerald-600 shadow-md transform scale-105"
                                                : "bg-white text-slate-600 border-slate-200 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
                                        )}
                                    >
                                        <Icon className="w-4 h-4" />
                                        {dept.name}
                                    </button>
                                );
                            })}
                        </div>

                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                className="gap-2 border-slate-200 text-slate-700 hover:bg-slate-50"
                                onClick={() => setWeekStart(addDays(weekStart, -7))}
                            >
                                <ChevronLeft className="w-4 h-4" />
                                上週
                            </Button>

                            <Button
                                variant="outline"
                                className="gap-2 border-slate-200 text-slate-700 hover:bg-slate-50"
                                onClick={() => setWeekStart(startOfWeek(new Date(), { weekStartsOn: 1 }))}
                            >
                                本週
                            </Button>

                            <Button
                                variant="outline"
                                className="gap-2 border-slate-200 text-slate-700 hover:bg-slate-50"
                                onClick={() => setWeekStart(addDays(weekStart, 7))}
                            >
                                下週
                                <ChevronRight className="w-4 h-4" />
                            </Button>

                            <Button
                                variant="outline"
                                className="gap-2 border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300"
                                disabled
                                title="尚未提供 PDF 匯出"
                            >
                            <Download className="w-4 h-4" />
                            下載本月門診表 (PDF)
                            </Button>
                        </div>
                    </div>

                    {/* Important Notice */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-xl mb-8 flex items-start gap-3 shadow-sm"
                    >
                        <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-amber-900">
                            <span className="font-bold block mb-1">掛號注意事項：</span>
                            <ul className="list-disc pl-4 space-y-1 opacity-90">
                                <li>初診病患請於看診時間前 30 分鐘至櫃檯報到填寫資料。</li>
                                <li>網路掛號開放時間為當日看診前 1 小時截止，逾時請至現場掛號。</li>
                                <li>若遇颱風等天然災害，依行政院人事行政總處公告停班停課為準。</li>
                            </ul>
                        </div>
                    </motion.div>

                    {/* Schedule Table */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden"
                    >
                        {error ? (
                            <div className="p-6 text-sm text-red-600">{error}</div>
                        ) : null}
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[800px]">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-200">
                                        <th className="p-4 w-24 text-center font-bold text-slate-700 sticky left-0 bg-slate-50 z-10 border-r border-slate-200">
                                            時段
                                        </th>
                                        {days.map((day) => (
                                            <th key={day.key} className="p-4 text-center font-bold text-emerald-800 bg-emerald-50/50 min-w-[140px]">
                                                <div className="flex flex-col items-center">
                                                    <span className="text-lg">{day.label}</span>
                                                    <span className="text-xs font-normal text-emerald-600/70 uppercase tracking-wider">{day.short}</span>
                                                </div>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {timeSlots.map((slot) => (
                                        <tr key={slot.id} className="group hover:bg-slate-50/50 transition-colors">
                                            {/* Time Column */}
                                            <td className="p-4 bg-white sticky left-0 z-10 border-r border-slate-100 group-hover:bg-slate-50 transition-colors">
                                                <div className="flex flex-col items-center justify-center h-full text-slate-600">
                                                    <span className="font-bold text-base">{slot.label}</span>
                                                    <span className="text-xs text-slate-400 mt-1 bg-slate-100 px-2 py-0.5 rounded-full whitespace-nowrap">{slot.time}</span>
                                                </div>
                                            </td>

                                            {/* Day Columns */}
                                            {days.map((day) => {
                                                const slotSchedules = scheduleMap[day.key]?.[slot.id] ?? [];
                                                return (
                                                    <td key={`${day.key}-${slot.id}`} className="p-3 align-top border-l border-slate-50">
                                                        <div className="flex flex-col gap-2 min-h-[80px]">
                                                            <AnimatePresence mode="popLayout">
                                                                {loading ? (
                                                                    <span className="text-slate-300 text-xs text-center py-4 block">載入中...</span>
                                                                ) : slotSchedules.length > 0 ? (
                                                                    slotSchedules.map((s, idx) => (
                                                                        <motion.div
                                                                            key={`${s.id}-${idx}`}
                                                                            initial={{ opacity: 0, scale: 0.9 }}
                                                                            animate={{ opacity: 1, scale: 1 }}
                                                                            exit={{ opacity: 0, scale: 0.9 }}
                                                                            whileHover={{ y: -2 }}
                                                                            className={cn(
                                                                                "p-2 rounded-lg text-sm font-medium text-center cursor-pointer transition-all shadow-sm border",
                                                                                "hover:shadow-md hover:border-emerald-200",
                                                                                s.doctor.departmentId === "internal"
                                                                                    ? "bg-blue-50 text-blue-700 border-blue-100"
                                                                                    : s.doctor.departmentId === "surgery"
                                                                                        ? "bg-amber-50 text-amber-700 border-amber-100"
                                                                                        : s.doctor.departmentId === "pediatrics"
                                                                                            ? "bg-orange-50 text-orange-700 border-orange-100"
                                                                                            : "bg-emerald-50 text-emerald-700 border-emerald-100"
                                                                            )}
                                                                        >
                                                                            {s.doctor.name} 醫師
                                                                        </motion.div>
                                                                    ))
                                                                ) : (
                                                                    <span className="text-slate-300 text-xs text-center py-4 block">- 休診 -</span>
                                                                )}
                                                            </AnimatePresence>
                                                        </div>
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="p-4 bg-slate-50 text-center text-sm text-slate-500 border-t border-slate-200">
                            * 門診時間若有異動，以現場掛號櫃檯公告為準
                        </div>
                    </motion.div>

                </div>
            </section>
        </div>
    );
}

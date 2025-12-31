"use client";

import { useEffect, useState } from "react";
import { Doctor } from "@/types";
import { format } from "date-fns";
import { zhTW } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Check } from "lucide-react";

type ExistingSchedule = {
    id: string;
    timeSlot: "Morning" | "Afternoon" | "Evening";
    startTime: string;
    endTime: string;
    maxPatients: number;
    currentPatients: number;
};

function slotLabel(slot: ExistingSchedule["timeSlot"]) {
    if (slot === "Morning") return "上午診";
    if (slot === "Afternoon") return "下午診";
    return "夜診";
}

export default function SchedulePage() {
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [selectedDoctorId, setSelectedDoctorId] = useState<string>("");
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

    const [existingSchedules, setExistingSchedules] = useState<ExistingSchedule[]>([]);
    const [hasActiveAppointments, setHasActiveAppointments] = useState(false);

    // Schedule form state for the selected date
    const [slots, setSlots] = useState({
        Morning: { active: false, max: 30, start: "09:00", end: "12:00" },
        Afternoon: { active: false, max: 30, start: "14:00", end: "17:00" },
        Evening: { active: false, max: 30, start: "18:00", end: "21:00" },
    });

    const loadDoctors = async () => {
        const res = await fetch("/api/admin/doctors", { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        const mapped = (data.doctors ?? []).map((d: any) => ({
            id: d.id,
            name: d.name,
            department: d.departmentId,
            title: d.title,
            specialties: d.specialties ?? [],
            imageUrl: d.imageUrl,
            introduction: d.introduction,
            isAvailable: d.isAvailable,
        })) as Doctor[];
        setDoctors(mapped);
    };

    useEffect(() => {
        void loadDoctors();
    }, []);

    // When date or doctor changes, load existing schedules
    const updateFormFromSchedule = async (date: Date, docId: string) => {
        // Reset defaults first
        const newSlots = {
            Morning: { active: false, max: 30, start: "09:00", end: "12:00" },
            Afternoon: { active: false, max: 30, start: "14:00", end: "17:00" },
            Evening: { active: false, max: 30, start: "18:00", end: "21:00" },
        };

        if (!docId || !date) {
            setSlots(newSlots);
            setExistingSchedules([]);
            setHasActiveAppointments(false);
            return;
        }

        const dateKey = format(date, "yyyy-MM-dd");
        const from = `${dateKey}T00:00:00`;
        const to = `${dateKey}T23:59:59`;

        const res = await fetch(
            `/api/admin/schedules?doctorId=${encodeURIComponent(docId)}&from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`,
            { cache: "no-store" }
        );

        if (res.ok) {
            const data = await res.json();
            const existingSchedules = (data.schedules ?? []) as ExistingSchedule[];

            setExistingSchedules(existingSchedules);
            setHasActiveAppointments(existingSchedules.some((s) => (s.currentPatients ?? 0) > 0));

            existingSchedules.forEach((s: any) => {
                if (s.timeSlot in newSlots) {
                    newSlots[s.timeSlot as keyof typeof newSlots] = {
                        active: true,
                        max: s.maxPatients,
                        start: s.startTime,
                        end: s.endTime,
                    };
                }
            });
        } else {
            setExistingSchedules([]);
            setHasActiveAppointments(false);
        }

        setSlots(newSlots);
    };

    const handleDateSelect = (date: Date | undefined) => {
        setSelectedDate(date);
        if (date && selectedDoctorId) {
            void updateFormFromSchedule(date, selectedDoctorId);
        }
    };

    const handleDoctorSelect = (docId: string) => {
        setSelectedDoctorId(docId);
        if (selectedDate && docId) {
            void updateFormFromSchedule(selectedDate, docId);
        }
    }

    const handleSave = () => {
        if (!selectedDate || !selectedDoctorId) return;

        if (hasActiveAppointments) {
            alert("此日期已有病患掛號，無法直接覆蓋排班。請先處理預約後再更新。");
            return;
        }

        void (async () => {
            const res = await fetch("/api/admin/schedules/replace", {
                method: "PUT",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({
                    doctorId: selectedDoctorId,
                    dateISO: format(selectedDate, "yyyy-MM-dd"),
                    slots,
                }),
            });

            if (res.ok) {
                alert("排班已更新！");
                await updateFormFromSchedule(selectedDate, selectedDoctorId);
                return;
            }

            const data = await res.json().catch(() => ({}));
            if (res.status === 409 && data?.error === "HAS_ACTIVE_APPOINTMENTS") {
                alert("此日期已有病患掛號，無法直接覆蓋排班。請先處理預約後再更新。");
                return;
            }

            alert("排班更新失敗，請稍後再試。");
        })();
    };

    return (
        <div className="space-y-8 h-full">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-slate-900">門診排程</h2>
                <p className="text-slate-500 mt-1">設定醫師的看診時段。</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start h-full">
                {/* Left Panel: Controls */}
                <div className="lg:col-span-4 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>1. 選擇醫師</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Select onValueChange={handleDoctorSelect} value={selectedDoctorId}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="請選擇醫師" />
                                </SelectTrigger>
                                <SelectContent>
                                    {doctors.map(d => (
                                        <SelectItem key={d.id} value={d.id}>{d.name} ({d.title})</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </CardContent>
                    </Card>

                    <Card className={!selectedDoctorId ? "opacity-50 pointer-events-none" : ""}>
                        <CardHeader>
                            <CardTitle>2. 選擇日期</CardTitle>
                        </CardHeader>
                        <CardContent className="flex justify-center">
                            <Calendar
                                mode="single"
                                selected={selectedDate}
                                onSelect={handleDateSelect}
                                className="rounded-md border shadow-sm"
                                locale={zhTW}
                            />
                        </CardContent>
                    </Card>
                </div>

                {/* Right Panel: Time Slots configuration */}
                <div className="lg:col-span-8">
                    <Card className={`h-full ${!selectedDoctorId || !selectedDate ? "opacity-50 pointer-events-none" : ""}`}>
                        <CardHeader>
                            <CardTitle className="flex justify-between items-center">
                                <span>3. 設定時段 - {selectedDate ? format(selectedDate, 'yyyy年MM月dd日 (eeee)', { locale: zhTW }) : ''}</span>
                                <Button
                                    onClick={handleSave}
                                    className="bg-primary hover:bg-primary/90"
                                    disabled={hasActiveAppointments}
                                    title={hasActiveAppointments ? "此日已有掛號，無法覆蓋排班" : undefined}
                                >
                                    <Check className="w-4 h-4 mr-2" />
                                    儲存排班
                                </Button>
                            </CardTitle>
                            <CardDescription>
                                勾選啟用的時段，並設定看診時間與人數上限。
                                {hasActiveAppointments ? (
                                    <div className="mt-2 text-sm text-red-600">
                                        此日期已有病患掛號，覆蓋排班將失敗（請先處理預約）。
                                    </div>
                                ) : null}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {existingSchedules.length > 0 ? (
                                <div className="rounded-lg border border-slate-100 bg-slate-50 p-3 text-sm text-slate-700">
                                    <div className="font-semibold mb-2">當日現有排班與掛號數</div>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                        {existingSchedules
                                            .slice()
                                            .sort((a, b) => {
                                                const order = { Morning: 0, Afternoon: 1, Evening: 2 } as const;
                                                return order[a.timeSlot] - order[b.timeSlot];
                                            })
                                            .map((s) => (
                                                <div key={s.id} className="rounded-md bg-white border border-slate-100 px-3 py-2">
                                                    <div className="font-medium">{slotLabel(s.timeSlot)}</div>
                                                    <div className="text-xs text-slate-500">{s.startTime} - {s.endTime}</div>
                                                    <div className="text-xs text-slate-600 mt-1">掛號：{s.currentPatients}/{s.maxPatients}</div>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            ) : null}

                            {(['Morning', 'Afternoon', 'Evening'] as const).map(slot => (
                                <div key={slot} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-lg border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                                    <div className="flex items-center gap-4 min-w-[150px]">
                                        <Switch
                                            checked={slots[slot].active}
                                            onCheckedChange={(checked) => setSlots({
                                                ...slots,
                                                [slot]: { ...slots[slot], active: checked }
                                            })}
                                        />
                                        <div className="flex flex-col">
                                            <span className="font-bold text-slate-800">
                                                {slot === 'Morning' ? '上午診' : slot === 'Afternoon' ? '下午診' : '夜診'}
                                            </span>
                                            <span className="text-xs text-slate-500">
                                                {slots[slot].start} - {slots[slot].end}
                                            </span>
                                        </div>
                                    </div>

                                    {slots[slot].active && (
                                        <div className="flex-1 flex gap-4 w-full sm:w-auto animate-in fade-in slide-in-from-left-4 duration-300">
                                            <div className="grid gap-2 flex-1">
                                                <Label htmlFor={`${slot}-start`} className="text-xs">開始時間</Label>
                                                <Input
                                                    id={`${slot}-start`}
                                                    value={slots[slot].start}
                                                    onChange={(e) => setSlots({
                                                        ...slots,
                                                        [slot]: { ...slots[slot], start: e.target.value }
                                                    })}
                                                    className="h-8"
                                                />
                                            </div>
                                            <div className="grid gap-2 flex-1">
                                                <Label htmlFor={`${slot}-end`} className="text-xs">結束時間</Label>
                                                <Input
                                                    id={`${slot}-end`}
                                                    value={slots[slot].end}
                                                    onChange={(e) => setSlots({
                                                        ...slots,
                                                        [slot]: { ...slots[slot], end: e.target.value }
                                                    })}
                                                    className="h-8"
                                                />
                                            </div>
                                            <div className="grid gap-2 w-24">
                                                <Label htmlFor={`${slot}-max`} className="text-xs">人數上限</Label>
                                                <Input
                                                    id={`${slot}-max`}
                                                    type="number"
                                                    value={slots[slot].max}
                                                    onChange={(e) => setSlots({
                                                        ...slots,
                                                        [slot]: { ...slots[slot], max: parseInt(e.target.value) || 0 }
                                                    })}
                                                    className="h-8"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

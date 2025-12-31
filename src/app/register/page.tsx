"use client";

import { useEffect, useMemo, useState } from "react";
import { useHospital } from "@/lib/store";
import { Doctor, Schedule, Department } from "@/types";
import { format } from "date-fns";
import { zhTW } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Activity, ArrowLeft, ArrowRight, Calendar, Check, Clock, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const steps = ["選擇科別", "選擇醫師", "選擇時間", "填寫資料", "完成掛號"];

export default function RegisterPage() {
    const { doctors, departments, isLoading } = useHospital();

    const [tab, setTab] = useState<"register" | "lookup">("register");

    const [currentStep, setCurrentStep] = useState(0);
    const [selectedDept, setSelectedDept] = useState<string>("");
    const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
    const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);

    const [doctorSchedules, setDoctorSchedules] = useState<Schedule[]>([]);
    const [created, setCreated] = useState<{ id: string; queueNumber: number } | null>(null);

    const [patientForm, setPatientForm] = useState({
        name: "",
        idNumber: "",
        birthDate: "",
        phone: ""
    });

    const nextStep = () => setCurrentStep((p) => Math.min(p + 1, steps.length - 1));
    const prevStep = () => setCurrentStep((p) => Math.max(p - 1, 0));

    const availableDoctors = useMemo(
        () => doctors.filter((d) => d.department === selectedDept),
        [doctors, selectedDept]
    );

    useEffect(() => {
        if (!selectedDoctor?.id) {
            setDoctorSchedules([]);
            return;
        }

        void (async () => {
            const res = await fetch(`/api/public/schedules?doctorId=${encodeURIComponent(selectedDoctor.id)}`, { cache: "no-store" });
            if (!res.ok) {
                setDoctorSchedules([]);
                return;
            }
            const data = await res.json();
            const mapped = (data.schedules ?? []).map((s: any) => ({
                id: s.id,
                doctorId: s.doctorId,
                date: new Date(s.date),
                timeSlot: s.timeSlot,
                startTime: s.startTime,
                endTime: s.endTime,
                maxPatients: s.maxPatients,
                currentPatients: s.currentPatients ?? 0,
                isAvailable: s.isAvailable,
            })) as Schedule[];
            setDoctorSchedules(mapped);
        })();
    }, [selectedDoctor?.id]);

    const availableSchedules = useMemo(() => {
        return doctorSchedules
            .filter((s) => new Date(s.date) >= new Date())
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }, [doctorSchedules]);

    const timeSlotLabel = (timeSlot: Schedule["timeSlot"]) =>
        timeSlot === "Morning" ? "上午" : timeSlot === "Afternoon" ? "下午" : "夜間";

    const handleRegister = () => {
        if (!selectedSchedule || !patientForm.name) return;

        void (async () => {
            const res = await fetch("/api/public/appointments", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({
                    scheduleId: selectedSchedule.id,
                    patient: {
                        name: patientForm.name,
                        idNumber: patientForm.idNumber,
                        birthDate: patientForm.birthDate,
                        phone: patientForm.phone,
                    },
                }),
            });

            const data = await res.json().catch(() => ({}));

            if (!res.ok) {
                if (data?.error === "SCHEDULE_FULL") alert("此診次已額滿，請重新選擇其他時段。\n");
                else if (data?.error === "DUPLICATE_APPOINTMENT") alert("同一診次不可重複掛號。\n");
                else alert("掛號失敗，請稍後再試。\n");
                return;
            }

            setCreated({ id: data.appointment.id, queueNumber: data.appointment.queueNumber });
            nextStep();
        })();
    };

    const [lookupForm, setLookupForm] = useState({ idNumber: "", phone: "" });
    const [lookupLoading, setLookupLoading] = useState(false);
    const [lookupError, setLookupError] = useState<string | null>(null);
    const [lookupResults, setLookupResults] = useState<any[]>([]);
    const [expandedApptId, setExpandedApptId] = useState<string | null>(null);
    const [rescheduleOptionsByDoctor, setRescheduleOptionsByDoctor] = useState<Record<string, Schedule[]>>({});
    const [rescheduleSelection, setRescheduleSelection] = useState<Record<string, string>>({});

    const handleLookup = async () => {
        setLookupLoading(true);
        setLookupError(null);
        setExpandedApptId(null);
        try {
            const res = await fetch("/api/public/appointments/lookup", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({ idNumber: lookupForm.idNumber, phone: lookupForm.phone }),
            });

            const data = await res.json().catch(() => ({}));
            if (!res.ok) {
                setLookupError("查詢失敗，請確認資料是否正確");
                setLookupResults([]);
                return;
            }

            setLookupResults(data.appointments ?? []);
        } catch {
            setLookupError("查詢失敗，請稍後再試");
            setLookupResults([]);
        } finally {
            setLookupLoading(false);
        }
    };

    const ensureRescheduleOptions = async (doctorId: string) => {
        if (rescheduleOptionsByDoctor[doctorId]) return;

        const res = await fetch(`/api/public/schedules?doctorId=${encodeURIComponent(doctorId)}`, { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        const mapped = (data.schedules ?? []).map((s: any) => ({
            id: s.id,
            doctorId: s.doctorId,
            date: new Date(s.date),
            timeSlot: s.timeSlot,
            startTime: s.startTime,
            endTime: s.endTime,
            maxPatients: s.maxPatients,
            currentPatients: s.currentPatients ?? 0,
            isAvailable: s.isAvailable,
        })) as Schedule[];
        setRescheduleOptionsByDoctor((prev) => ({ ...prev, [doctorId]: mapped }));
    };

    return (
        <div className="min-h-screen bg-slate-50 pt-24 pb-12">
            <div className="container px-4 max-w-4xl mx-auto">

                <Tabs value={tab} onValueChange={(v) => setTab(v as any)} className="mb-10">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="register">我要掛號</TabsTrigger>
                        <TabsTrigger value="lookup">查詢/取消/改期</TabsTrigger>
                    </TabsList>

                    <TabsContent value="lookup" className="mt-8">
                        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden p-8 space-y-6">
                            <h2 className="text-2xl font-bold text-slate-900">查詢預約</h2>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label htmlFor="lk-id">身分證字號</Label>
                                    <Input
                                        id="lk-id"
                                        value={lookupForm.idNumber}
                                        onChange={(e) => setLookupForm({ ...lookupForm, idNumber: e.target.value.toUpperCase() })}
                                        placeholder="A123456789"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="lk-phone">手機號碼</Label>
                                    <Input
                                        id="lk-phone"
                                        value={lookupForm.phone}
                                        onChange={(e) => setLookupForm({ ...lookupForm, phone: e.target.value })}
                                        placeholder="0912345678"
                                    />
                                </div>
                            </div>
                            {lookupError && <div className="text-sm text-red-600">{lookupError}</div>}
                            <Button onClick={() => void handleLookup()} disabled={lookupLoading || !lookupForm.idNumber || !lookupForm.phone}>
                                {lookupLoading ? "查詢中..." : "查詢"}
                            </Button>

                            <div className="space-y-4">
                                {lookupResults.length === 0 ? (
                                    <div className="text-slate-500 text-sm">查詢結果會顯示在這裡。</div>
                                ) : (
                                    lookupResults.map((a) => {
                                        const doctor = a.schedule?.doctor;
                                        const date = a.schedule?.date ? new Date(a.schedule.date) : null;
                                        const timeSlot = a.schedule?.timeSlot;
                                        const doctorId = doctor?.id as string | undefined;
                                        const options = doctorId ? rescheduleOptionsByDoctor[doctorId] : undefined;

                                        return (
                                            <Card key={a.id} className="border border-slate-100">
                                                <CardContent className="p-6 space-y-3">
                                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                                                        <div>
                                                            <div className="font-bold text-slate-900">
                                                                {doctor?.name} 醫師 {doctor?.title ? `(${doctor.title})` : ""}
                                                            </div>
                                                            <div className="text-sm text-slate-600">
                                                                {date ? format(date, "yyyy/MM/dd (eeee)", { locale: zhTW }) : ""} {timeSlot ? timeSlotLabel(timeSlot) : ""}
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <div className="text-sm text-slate-500">預約號碼</div>
                                                            <div className="font-bold text-2xl text-primary"># {a.queueNumber}</div>
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-wrap gap-2">
                                                        <Button
                                                            variant="outline"
                                                            onClick={() => {
                                                                setExpandedApptId((prev) => (prev === a.id ? null : a.id));
                                                                if (doctorId) void ensureRescheduleOptions(doctorId);
                                                            }}
                                                            disabled={a.status === "Cancelled"}
                                                        >
                                                            改期
                                                        </Button>
                                                        <Button
                                                            variant="destructive"
                                                            onClick={() => {
                                                                void (async () => {
                                                                    await fetch(`/api/public/appointments/${a.id}/cancel`, {
                                                                        method: "POST",
                                                                        headers: { "content-type": "application/json" },
                                                                        body: JSON.stringify({ idNumber: lookupForm.idNumber, phone: lookupForm.phone }),
                                                                    });
                                                                    await handleLookup();
                                                                })();
                                                            }}
                                                            disabled={a.status === "Cancelled"}
                                                        >
                                                            取消
                                                        </Button>
                                                        <div className="ml-auto text-sm text-slate-500">狀態：{a.status}</div>
                                                    </div>

                                                    {expandedApptId === a.id && doctorId && (
                                                        <div className="pt-4 border-t border-slate-100 space-y-3">
                                                            <div className="text-sm text-slate-600">選擇新的看診時段</div>
                                                            <div className="flex flex-col md:flex-row gap-3">
                                                                <Select
                                                                    value={rescheduleSelection[a.id] || ""}
                                                                    onValueChange={(val) => setRescheduleSelection((prev) => ({ ...prev, [a.id]: val }))}
                                                                >
                                                                    <SelectTrigger className="w-full md:w-[360px]">
                                                                        <SelectValue placeholder={options ? "請選擇時段" : "載入中..."} />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        {(options ?? [])
                                                                            .filter((s) => s.id !== a.scheduleId)
                                                                            .filter((s) => (s.currentPatients ?? 0) < s.maxPatients)
                                                                            .map((s) => (
                                                                                <SelectItem key={s.id} value={s.id}>
                                                                                    {format(new Date(s.date), "MM/dd (eee)", { locale: zhTW })} {timeSlotLabel(s.timeSlot)} {s.startTime}（{s.currentPatients}/{s.maxPatients}）
                                                                                </SelectItem>
                                                                            ))}
                                                                    </SelectContent>
                                                                </Select>
                                                                <Button
                                                                    onClick={() => {
                                                                        const newScheduleId = rescheduleSelection[a.id];
                                                                        if (!newScheduleId) return;
                                                                        void (async () => {
                                                                            const res = await fetch(`/api/public/appointments/${a.id}/reschedule`, {
                                                                                method: "POST",
                                                                                headers: { "content-type": "application/json" },
                                                                                body: JSON.stringify({ idNumber: lookupForm.idNumber, phone: lookupForm.phone, newScheduleId }),
                                                                            });
                                                                            const data = await res.json().catch(() => ({}));
                                                                            if (!res.ok) {
                                                                                if (data?.error === "SCHEDULE_FULL") alert("新時段已額滿，請換一個。");
                                                                                else alert("改期失敗，請稍後再試。");
                                                                                return;
                                                                            }
                                                                            await handleLookup();
                                                                            setExpandedApptId(null);
                                                                        })();
                                                                    }}
                                                                    disabled={!rescheduleSelection[a.id]}
                                                                >
                                                                    確認改期
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </CardContent>
                                            </Card>
                                        );
                                    })
                                )}
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="register" />
                </Tabs>

                {tab === "register" && (
                    <>

                {/* Progress Bar */}
                <div className="mb-12 relative">
                    <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-200 -translate-y-1/2 rounded-full" />
                    <div
                        className="absolute top-1/2 left-0 h-1 bg-primary -translate-y-1/2 rounded-full transition-all duration-500 ease-in-out"
                        style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
                    />
                    <div className="relative flex justify-between">
                        {steps.map((step, i) => (
                            <div key={i} className="flex flex-col items-center">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 transition-all duration-300 z-10 ${i <= currentStep ? "bg-primary border-white text-white shadow-md" : "bg-white border-slate-200 text-slate-400"
                                    }`}>
                                    {i < currentStep ? <Check className="w-5 h-5" /> : i + 1}
                                </div>
                                <span className={`text-xs font-medium mt-2 absolute -bottom-6 w-20 text-center transition-colors ${i <= currentStep ? "text-primary" : "text-slate-400"
                                    }`}>{step}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Content Area */}
                <div className="mt-8 min-h-[400px]">
                    <AnimatePresence mode="wait">

                        {/* STEP 1: Department Selection */}
                        {currentStep === 0 && (
                            <motion.div
                                key="step0"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="grid grid-cols-1 md:grid-cols-2 gap-6"
                            >
                                {departments.map((dept) => (
                                    <Card
                                        key={dept.id}
                                        className="cursor-pointer hover:border-primary hover:shadow-lg transition-all group"
                                        onClick={() => { setSelectedDept(dept.id); nextStep(); }}
                                    >
                                        <CardContent className="p-6 flex items-center gap-6">
                                            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-500 group-hover:bg-primary group-hover:text-white transition-colors">
                                                <Activity className="w-8 h-8" />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold text-slate-900 group-hover:text-primary transition-colors">{dept.name}</h3>
                                                <p className="text-slate-500 text-sm mt-1 line-clamp-2">{dept.description}</p>
                                            </div>
                                            <ArrowRight className="w-5 h-5 ml-auto text-slate-300 group-hover:text-primary" />
                                        </CardContent>
                                    </Card>
                                ))}
                            </motion.div>
                        )}

                        {/* STEP 2: Doctor Selection */}
                        {currentStep === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div className="flex items-center gap-2 mb-6 text-slate-500 bg-white p-3 rounded-lg shadow-sm w-fit cursor-pointer hover:text-primary" onClick={prevStep}>
                                    <ArrowLeft className="w-4 h-4" /> 回到科別選擇
                                </div>

                                <h2 className="text-2xl font-bold text-slate-900 mb-6">請選擇 {departments.find(d => d.id === selectedDept)?.name} 醫師</h2>

                                {availableDoctors.length === 0 ? (
                                    <div className="text-center py-12 bg-white rounded-xl">
                                        <p className="text-slate-500">目前該科別暫無醫師排班。</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        {availableDoctors.map((doc) => (
                                            <Card
                                                key={doc.id}
                                                className="cursor-pointer hover:border-primary hover:shadow-lg transition-all group overflow-hidden"
                                                onClick={() => { setSelectedDoctor(doc); nextStep(); }}
                                            >
                                                <div className="aspect-[4/3] relative bg-slate-100">
                                                    <img src={doc.imageUrl} className="w-full h-full object-cover" alt={doc.name} />
                                                </div>
                                                <CardContent className="p-4">
                                                    <h3 className="text-lg font-bold">{doc.name} 醫師</h3>
                                                    <p className="text-primary text-sm mb-2">{doc.title}</p>
                                                    <p className="text-slate-500 text-xs line-clamp-2">{doc.specialties.join("、")}</p>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {/* STEP 3: Time Selection */}
                        {currentStep === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div className="flex items-center gap-2 mb-6 text-slate-500 bg-white p-3 rounded-lg shadow-sm w-fit cursor-pointer hover:text-primary" onClick={prevStep}>
                                    <ArrowLeft className="w-4 h-4" /> 重新選擇醫師
                                </div>

                                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 mb-6 flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-full overflow-hidden bg-slate-100 flex-shrink-0">
                                        <img src={selectedDoctor?.imageUrl} alt="" className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-slate-900">{selectedDoctor?.name} 醫師</h2>
                                        <p className="text-slate-500">{departments.find(d => d.id === selectedDept)?.name} | 門診時刻表</p>
                                    </div>
                                </div>

                                {availableSchedules.length === 0 ? (
                                    <div className="text-center py-12 bg-white rounded-xl">
                                        <p className="text-slate-500">該醫師近期無可預約診次。</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {availableSchedules.map((schedule) => (
                                            <Card
                                                key={schedule.id}
                                                className={`cursor-pointer transition-all border-l-4 ${schedule.currentPatients >= schedule.maxPatients
                                                        ? "opacity-50 pointer-events-none border-l-slate-300"
                                                        : "hover:shadow-md hover:translate-x-1 border-l-primary"
                                                    }`}
                                                onClick={() => { setSelectedSchedule(schedule); nextStep(); }}
                                            >
                                                <CardContent className="p-4 flex justify-between items-center">
                                                    <div>
                                                        <p className="font-bold text-lg text-slate-800">
                                                            {format(new Date(schedule.date), 'MM/dd (eeee)', { locale: zhTW })}
                                                        </p>
                                                        <div className="flex items-center gap-2 text-slate-500 text-sm mt-1">
                                                            <Clock className="w-4 h-4" />
                                                            <span>{schedule.timeSlot === 'Morning' ? '上午' : schedule.timeSlot === 'Afternoon' ? '下午' : '夜間'} {schedule.startTime}</span>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <span className={`text-sm font-bold ${schedule.currentPatients >= schedule.maxPatients ? 'text-red-500' : 'text-emerald-600'}`}>
                                                            {schedule.currentPatients >= schedule.maxPatients ? '額滿' : '可預約'}
                                                        </span>
                                                        <p className="text-xs text-slate-400 mt-1">
                                                            已掛 {schedule.currentPatients}/{schedule.maxPatients}
                                                        </p>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {/* STEP 4: Patient Info */}
                        {currentStep === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="max-w-2xl mx-auto"
                            >
                                <div className="flex items-center gap-2 mb-6 text-slate-500 cursor-pointer hover:text-primary" onClick={prevStep}>
                                    <ArrowLeft className="w-4 h-4" /> 重選時間
                                </div>

                                <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
                                    <div className="bg-primary/5 p-6 border-b border-primary/10">
                                        <h2 className="text-xl font-bold text-primary flex items-center gap-2">
                                            <Calendar className="w-5 h-5" /> 預約資訊確認
                                        </h2>
                                        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <p className="text-slate-500">預約醫師</p>
                                                <p className="font-medium">{selectedDoctor?.name}</p>
                                            </div>
                                            <div>
                                                <p className="text-slate-500">看診科別</p>
                                                <p className="font-medium">{departments.find(d => d.id === selectedDept)?.name}</p>
                                            </div>
                                            <div>
                                                <p className="text-slate-500">看診日期</p>
                                                <p className="font-medium text-lg text-slate-900">
                                                    {selectedSchedule && format(new Date(selectedSchedule.date), 'yyyy/MM/dd (eeee)', { locale: zhTW })}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-slate-500">時段</p>
                                                <p className="font-medium">
                                                    {selectedSchedule?.timeSlot === 'Morning' ? '上午' : selectedSchedule?.timeSlot === 'Afternoon' ? '下午' : '夜間'}
                                                    ({selectedSchedule?.startTime})
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-8 space-y-6">
                                        <h3 className="font-bold text-lg border-b pb-2 mb-4">填寫基本資料</h3>

                                        <div className="grid gap-2">
                                            <Label htmlFor="p-name">姓名</Label>
                                            <Input
                                                id="p-name"
                                                placeholder="請輸入真實姓名"
                                                value={patientForm.name}
                                                onChange={(e) => setPatientForm({ ...patientForm, name: e.target.value })}
                                            />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="p-id">身分證字號</Label>
                                            <Input
                                                id="p-id"
                                                placeholder="A123456789"
                                                value={patientForm.idNumber}
                                                onChange={(e) => setPatientForm({ ...patientForm, idNumber: e.target.value.toUpperCase() })}
                                            />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="p-birth">出生年月日</Label>
                                            <Input
                                                id="p-birth"
                                                type="date"
                                                value={patientForm.birthDate}
                                                onChange={(e) => setPatientForm({ ...patientForm, birthDate: e.target.value })}
                                            />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="p-phone">手機號碼</Label>
                                            <Input
                                                id="p-phone"
                                                placeholder="0912345678"
                                                value={patientForm.phone}
                                                onChange={(e) => setPatientForm({ ...patientForm, phone: e.target.value })}
                                            />
                                        </div>

                                        <Button
                                            size="lg"
                                            className="w-full mt-6 text-lg h-12"
                                            onClick={handleRegister}
                                            disabled={!patientForm.name || !patientForm.idNumber || !patientForm.phone}
                                        >
                                            確認掛號
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* STEP 5: Success */}
                        {currentStep === 4 && (
                            <motion.div
                                key="step4"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center max-w-lg mx-auto bg-white p-12 rounded-3xl shadow-xl border border-slate-100"
                            >
                                <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Check className="w-12 h-12" />
                                </div>
                                <h2 className="text-3xl font-bold text-slate-900 mb-2">掛號成功！</h2>
                                <p className="text-slate-500 mb-8">您的預約已完成，請準時報到。</p>

                                <div className="bg-slate-50 rounded-xl p-6 text-left space-y-3 mb-8">
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">預約號碼</span>
                                        <span className="font-bold text-2xl text-primary"># {created?.queueNumber ?? "-"}</span>
                                    </div>
                                    {created?.id && (
                                        <div className="flex justify-between">
                                            <span className="text-slate-500">預約代碼</span>
                                            <span className="font-mono text-sm text-slate-700">{created.id}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between border-t border-slate-200 pt-3">
                                        <span className="text-slate-500">醫師</span>
                                        <span className="font-medium">{selectedDoctor?.name}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">時間</span>
                                        <span className="font-medium">
                                            {selectedSchedule && format(new Date(selectedSchedule.date), 'MM/dd')} {selectedSchedule?.timeSlot === 'Morning' ? '早' : '午'}
                                        </span>
                                    </div>
                                </div>

                                <Button asChild variant="outline" className="w-full">
                                    <a href="/">返回首頁</a>
                                </Button>
                            </motion.div>
                        )}

                    </AnimatePresence>
                </div>

                    </>
                )}
            </div>
        </div>
    );
}

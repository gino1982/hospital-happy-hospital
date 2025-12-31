"use client";

import { useEffect, useState } from "react";
import { Doctor, Department } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Search, MoreVertical, Trash2, Edit } from "lucide-react";

export default function DoctorsPage() {
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isAddOpen, setIsAddOpen] = useState(false);

    const load = async () => {
        const [deptRes, docRes] = await Promise.all([
            fetch("/api/public/departments", { cache: "no-store" }),
            fetch("/api/admin/doctors", { cache: "no-store" }),
        ]);

        if (deptRes.ok) {
            const data = await deptRes.json();
            setDepartments(data.departments ?? []);
        }

        if (docRes.ok) {
            const data = await docRes.json();
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
        }
    };

    useEffect(() => {
        void load();
    }, []);

    // Form State
    const [formData, setFormData] = useState<Partial<Doctor>>({
        name: "",
        title: "",
        department: "",
        introduction: "",
        specialties: [],
        imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=NewDoc", // Default placeholder
    });
    const [specialtiesInput, setSpecialtiesInput] = useState("");

    const handleAddDoctor = () => {
        if (!formData.name || !formData.department) return; // Simple validation

        const run = async () => {
            await fetch("/api/admin/doctors", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({
                    name: formData.name,
                    title: formData.title || "主治醫師",
                    departmentId: formData.department,
                    introduction: formData.introduction || "",
                    specialties: specialtiesInput.split(",").map(s => s.trim()).filter(s => s !== ""),
                    imageUrl: formData.imageUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.name}`,
                    isAvailable: true,
                }),
            });
            setIsAddOpen(false);
            setFormData({ name: "", title: "", department: "", introduction: "", imageUrl: "" });
            setSpecialtiesInput("");
            await load();
        };

        void run();
    };

    const filteredDoctors = doctors.filter(doc =>
        doc.name.includes(searchTerm) ||
        doc.department.includes(searchTerm) ||
        doc.title.includes(searchTerm)
    );

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900">醫師管理</h2>
                    <p className="text-slate-500 mt-1">管理醫院的醫療團隊成員。</p>
                </div>
                <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-primary hover:bg-primary/90">
                            <Plus className="w-4 h-4 mr-2" />
                            新增醫師
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle>新增醫師資料</DialogTitle>
                            <DialogDescription>
                                請填寫醫師的基本資訊。點擊儲存以完成新增。
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="name" className="text-right">姓名</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="col-span-3"
                                    placeholder="例如：王小明"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="title" className="text-right">職稱</Label>
                                <Input
                                    id="title"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="col-span-3"
                                    placeholder="例如：主治醫師"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="dept" className="text-right">科別</Label>
                                <Select
                                    onValueChange={(val) => setFormData({ ...formData, department: val })}
                                    defaultValue={formData.department}
                                >
                                    <SelectTrigger className="col-span-3">
                                        <SelectValue placeholder="選擇科別" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {departments.map(d => (
                                            <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="specialties" className="text-right">專長</Label>
                                <Input
                                    id="specialties"
                                    value={specialtiesInput}
                                    onChange={(e) => setSpecialtiesInput(e.target.value)}
                                    className="col-span-3"
                                    placeholder="以逗號分隔，例如：感冒, 此外科"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-start gap-4">
                                <Label htmlFor="intro" className="text-right mt-2">介紹</Label>
                                <Textarea
                                    id="intro"
                                    value={formData.introduction}
                                    onChange={(e) => setFormData({ ...formData, introduction: e.target.value })}
                                    className="col-span-3 min-h-[100px]"
                                    placeholder="醫師簡介..."
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="submit" onClick={handleAddDoctor}>儲存醫師</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="flex items-center space-x-2 bg-white p-2 rounded-lg border border-slate-200 shadow-sm max-w-md">
                <Search className="w-5 h-5 text-slate-400 ml-2" />
                <Input
                    className="border-none shadow-none focus-visible:ring-0"
                    placeholder="搜尋醫師姓名或科別..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredDoctors.map((doctor) => {
                    const deptName = departments.find(d => d.id === doctor.department)?.name || doctor.department;
                    return (
                        <Card key={doctor.id} className="group overflow-hidden border-none shadow-sm hover:shadow-lg transition-all duration-300">
                            <CardContent className="p-0">
                                <div className="aspect-square relative overflow-hidden bg-slate-100">
                                    <img src={doctor.imageUrl} alt={doctor.name} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                                    <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button
                                            size="icon"
                                            variant="secondary"
                                            className="h-8 w-8 rounded-full bg-white/90 text-red-500 hover:bg-red-50"
                                            onClick={() => {
                                                void (async () => {
                                                    await fetch(`/api/admin/doctors/${doctor.id}`, { method: "DELETE" });
                                                    await load();
                                                })();
                                            }}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h3 className="font-bold text-lg text-slate-900">{doctor.name}</h3>
                                            <p className="text-sm text-primary font-medium">{deptName} | {doctor.title}</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap gap-1 mt-3">
                                        {doctor.specialties.slice(0, 3).map((spec, i) => (
                                            <span key={i} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-1 rounded-full">{spec}</span>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}

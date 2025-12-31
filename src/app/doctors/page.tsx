"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useHospital } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Stethoscope, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function DoctorsPage() {
    return (
        <Suspense fallback={null}>
            <DoctorsPageInner />
        </Suspense>
    );
}

function DoctorsPageInner() {
    const { doctors, departments } = useHospital();
    const searchParams = useSearchParams();
    const initialDept = searchParams?.get("dept") || "all";

    const [activeDept, setActiveDept] = useState(initialDept);
    const [searchTerm, setSearchTerm] = useState("");

    const filteredDoctors = doctors.filter(doc => {
        const matchesDept = activeDept === "all" || doc.department === activeDept;
        const matchesSearch = doc.name.includes(searchTerm) || doc.specialties.some(s => s.includes(searchTerm));
        return matchesDept && matchesSearch;
    });

    return (
        <div className="min-h-screen bg-slate-50 pt-24 pb-16">
            <div className="container px-4 md:px-6 mx-auto">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h1 className="text-4xl font-bold text-slate-900 mb-4">專業醫療團隊</h1>
                    <p className="text-lg text-slate-600">
                        我們擁有經驗豐富的專科醫師陣容，以視病猶親的態度，提供您最專業的醫療照護。
                    </p>
                </div>

                {/* Filters */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
                    <div className="flex flex-wrap gap-2 justify-center">
                        <Button
                            variant={activeDept === "all" ? "default" : "outline"}
                            onClick={() => setActiveDept("all")}
                            className="rounded-full"
                        >
                            全部科別
                        </Button>
                        {departments.map(dept => (
                            <Button
                                key={dept.id}
                                variant={activeDept === dept.id ? "default" : "outline"}
                                onClick={() => setActiveDept(dept.id)}
                                className="rounded-full"
                            >
                                {dept.name}
                            </Button>
                        ))}
                    </div>

                    <div className="relative w-full md:w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <Input
                            placeholder="搜尋醫師姓名或專長..."
                            className="pl-9 rounded-full bg-white border-slate-200"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {filteredDoctors.length === 0 ? (
                        <div className="col-span-full text-center py-20 text-slate-500">
                            沒有找到符合條件的醫師。
                        </div>
                    ) : (
                        filteredDoctors.map((doc, i) => (
                            <motion.div
                                key={doc.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                            >
                                <Card className="h-full overflow-hidden border-none shadow-md hover:shadow-xl transition-all duration-300 group flex flex-col">
                                    <div className="aspect-[4/3] bg-slate-200 relative overflow-hidden">
                                        <img
                                            src={doc.imageUrl}
                                            alt={doc.name}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                                            <p className="text-white text-sm line-clamp-3 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                                {doc.introduction}
                                            </p>
                                        </div>
                                    </div>
                                    <CardContent className="p-6 flex flex-col flex-1">
                                        <div className="mb-4">
                                            <div className="text-sm font-bold text-primary mb-1 uppercase tracking-wider">
                                                {departments.find(d => d.id === doc.department)?.name}
                                            </div>
                                            <h3 className="text-2xl font-bold text-slate-900">{doc.name} 醫師</h3>
                                            <p className="text-slate-500 text-sm">{doc.title}</p>
                                        </div>

                                        <div className="flex flex-wrap gap-2 mb-6">
                                            {doc.specialties.slice(0, 3).map((spec, idx) => (
                                                <Badge key={idx} variant="secondary" className="bg-slate-100 text-slate-600 font-normal">
                                                    {spec}
                                                </Badge>
                                            ))}
                                        </div>

                                        <div className="mt-auto">
                                            <Link href={`/register?dept=${doc.department}&doc=${doc.id}`} passHref>
                                                <Button className="w-full rounded-full group-hover:bg-primary/90">
                                                    立即掛號 <ArrowRight className="w-4 h-4 ml-2" />
                                                </Button>
                                            </Link>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

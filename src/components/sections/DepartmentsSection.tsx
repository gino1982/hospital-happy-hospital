"use client";

import { ArrowRight, Baby, Heart, Stethoscope, Users, Activity } from "lucide-react";
import { motion } from "framer-motion";
import { useHospital } from "@/lib/store";

// Helper for icon mapping
const getDeptIcon = (iconName: string) => {
    switch (iconName) {
        case "Baby": return <Baby className="w-6 h-6" />;
        case "Heart": return <Heart className="w-6 h-6" />;
        case "Stethoscope": return <Stethoscope className="w-6 h-6" />;
        case "Trees": return <Users className="w-6 h-6" />;
        default: return <Activity className="w-6 h-6" />;
    }
};

export function DepartmentsSection() {
    const { departments } = useHospital();

    return (
        <section className="py-20 bg-slate-50">
            <div className="container mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center max-w-3xl mx-auto mb-16"
                >
                    <span className="text-emerald-600 font-bold tracking-wider uppercase text-sm">Departments</span>
                    <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mt-3 mb-6">全方位的醫療服務</h2>
                    <div className="w-20 h-1.5 bg-emerald-500 mx-auto rounded-full mb-6" />
                    <p className="text-slate-600 text-lg leading-relaxed">
                        我們提供多元且專業的診療科別，結合先進儀器與舒適環境，<br className="hidden md:block" />滿足不同年齡層與性別的健康需求
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {departments.map((dept, index) => (
                        <motion.div
                            key={dept.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            viewport={{ once: true }}
                        >
                            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl hover:shadow-emerald-500/5 hover:-translate-y-1 transition-all duration-500 border border-slate-100 h-full flex flex-col items-start group cursor-pointer relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-bl-[100px] -mr-4 -mt-4 transition-transform group-hover:scale-150 duration-500 origin-top-right z-0"></div>

                                <div className="relative z-10 w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-6 text-emerald-700 group-hover:text-white group-hover:bg-emerald-500 transition-colors duration-300">
                                    {getDeptIcon(dept.icon || "")}
                                </div>

                                <h3 className="relative z-10 text-xl font-bold text-slate-900 mb-3 group-hover:text-emerald-700 transition-colors">{dept.name}</h3>
                                <p className="relative z-10 text-slate-500 text-sm leading-relaxed mb-6 group-hover:text-slate-600">
                                    {dept.description}
                                </p>

                                <div className="relative z-10 mt-auto pt-4 flex items-center text-emerald-600 font-semibold text-sm group-hover:translate-x-2 transition-transform duration-300">
                                    了解詳情 <ArrowRight className="ml-2 w-4 h-4" />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

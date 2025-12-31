"use client";

import { Clock, Stethoscope, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

export function QuickInfoCards() {
    return (
        <section className="relative z-20 -mt-24 px-6 mb-20 pointer-events-none">
            <div className="container mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 100 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6 pointer-events-auto"
                >
                    {/* Card 1 */}
                    <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group">
                        <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6 text-emerald-600 group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300">
                            <Clock className="w-7 h-7" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-2">門診時間</h3>
                        <p className="text-slate-500">週一至週六<br />早 09:00 - 晚 21:00</p>
                    </div>

                    {/* Card 2 */}
                    <div className="bg-emerald-900 p-8 rounded-3xl shadow-xl shadow-emerald-900/20 border border-emerald-800 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-32 bg-emerald-800/20 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                        <div className="relative z-10">
                            <div className="w-14 h-14 bg-emerald-800 rounded-2xl flex items-center justify-center mb-6 text-emerald-400 group-hover:scale-110 group-hover:bg-white group-hover:text-emerald-900 transition-all duration-300">
                                <Stethoscope className="w-7 h-7" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">專業團隊</h3>
                            <p className="text-emerald-200/80">由醫學中心主任級醫師<br />親自為您看診</p>
                        </div>
                    </div>

                    {/* Card 3 */}
                    <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group">
                        <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6 text-emerald-600 group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300">
                            <ShieldCheck className="w-7 h-7" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-2">急診照護</h3>
                        <p className="text-slate-500">24小時婦產科急診<br />全年無休</p>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

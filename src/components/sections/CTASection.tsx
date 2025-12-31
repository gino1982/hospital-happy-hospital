"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";
import { motion } from "framer-motion";

export function CTASection() {
    return (
        <section className="py-24 bg-emerald-900 relative overflow-hidden">
            {/* Background Patterns */}
            <div className="absolute inset-0 z-0 opacity-10">
                <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <path d="M0 100 L100 0 L100 100 Z" fill="white" />
                </svg>
            </div>

            <div className="container relative z-10 px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="max-w-3xl mx-auto"
                >
                    <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">準備好預約看診了嗎？</h2>
                    <p className="text-emerald-100 text-lg md:text-xl mb-12 opacity-90 leading-relaxed font-light">
                        透過我們的線上掛號系統，您可以輕鬆查詢醫師門診時間並完成預約，<br className="hidden md:block" />
                        節省您寶貴的時間，讓就醫變得更簡單。
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-6">
                        <Link href="/register" prefetch={false}>
                            <Button size="lg" className="h-16 px-12 text-xl rounded-full bg-white text-emerald-900 hover:bg-emerald-50 hover:scale-105 transition-all shadow-2xl font-bold border-4 border-transparent hover:border-emerald-200">
                                立即前往掛號
                            </Button>
                        </Link>
                        <div className="flex items-center justify-center gap-3 text-emerald-100 font-medium bg-emerald-800/50 rounded-full px-8 h-16 border border-emerald-700/50">
                            <Phone className="w-5 h-5" />
                            <span>預約專線：(02) 2345-6789</span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

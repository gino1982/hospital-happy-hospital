"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
};

export function HeroSection() {
    return (
        <section className="relative h-[85vh] md:h-screen flex items-center justify-center overflow-hidden">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/images/hospital-lobby.png"
                    alt="Hospital Lobby"
                    fill
                    className="object-cover"
                    priority
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAUH/8QAIhAAAgEDAwUBAAAAAAAAAAAAAQIDAAQRBQYhEhMxQVFh/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAZEQACAwEAAAAAAAAAAAAAAAABAgADESH/2gAMAwEAAhEDEQA/ANI3Dv8A0+x7e3uLq0uJYriUxKY2UYyATnJ+VVpN9aVJGsjW94VYAj9X5SlTVi7E5Jz/2Q=="
                    quality={80}
                    sizes="100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/90 via-emerald-900/60 to-transparent" />
            </div>

            <div className="container relative z-10 px-6 pt-20">
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={staggerContainer}
                    className="max-w-4xl space-y-8"
                >
                    <motion.div variants={fadeIn}>
                        <Badge className="bg-emerald-500/20 text-emerald-100 hover:bg-emerald-500/30 backdrop-blur-md border border-emerald-400/30 px-6 py-2 text-sm uppercase tracking-[0.2em] mb-4 shadow-lg rounded-full">
                            Professional • Active • Caring
                        </Badge>
                    </motion.div>

                    <motion.h1 variants={fadeIn} className="text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-[1.1] tracking-tight">
                        守護您與家人的健康<br />
                        <span className="text-emerald-300">我們一直都在</span>
                    </motion.h1>

                    <motion.p variants={fadeIn} className="text-lg md:text-2xl text-slate-100 max-w-2xl leading-relaxed font-light opacity-90">
                        好幸福醫院引進尖端醫療設備，匯聚頂尖醫療團隊，為南台灣民眾提供醫學中心等級的專業照護。我們不僅治療疾病，更在乎您的感受。
                    </motion.p>

                    <motion.div variants={fadeIn} className="flex flex-col sm:flex-row gap-5 pt-6">
                        <Link href="/register" prefetch={false}>
                            <Button size="lg" className="h-16 px-10 text-xl w-full sm:w-auto rounded-full bg-emerald-500 hover:bg-emerald-400 text-white transition-all shadow-xl hover:shadow-emerald-500/20 hover:-translate-y-1">
                                立即掛號 <ArrowRight className="ml-2 w-6 h-6" />
                            </Button>
                        </Link>
                        <Link href="/about" prefetch={false}>
                            <Button variant="outline" size="lg" className="h-16 px-10 text-xl w-full sm:w-auto rounded-full border-emerald-300 text-emerald-100 bg-emerald-800/40 hover:bg-emerald-700/50 hover:text-white backdrop-blur-sm transition-all hover:border-emerald-200">
                                關於我們
                            </Button>
                        </Link>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}

"use client";

import { motion } from "framer-motion";
import { Heart, ShieldCheck, Users, Activity, Award, UserCheck, Clock, CheckCircle2 } from "lucide-react";
import Image from "next/image";

const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2
        }
    }
};

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="relative h-[60vh] md:h-[70vh] w-full overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/images/hospital-building.png"
                        alt="Hospital Building"
                        fill
                        className="object-cover"
                        priority
                    />
                </div>

                <div className="relative z-10 container mx-auto px-6 text-center text-white">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
                            深耕在地，守護健康
                        </h1>
                        <p className="text-xl md:text-2xl font-light opacity-90 max-w-2xl mx-auto">
                            四十年的醫療承諾，為您的健康提供最堅實的依靠
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Intro Section */}
            <section className="py-20 md:py-28 bg-neutral-50">
                <div className="container mx-auto px-6">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                        className="max-w-4xl mx-auto text-center"
                    >
                        <h2 className="text-emerald-800 font-bold text-3xl md:text-4xl mb-8">
                            以病人為中心 提供全方位的醫療照護
                        </h2>
                        <div className="space-y-6 text-lg text-slate-600 leading-relaxed text-justify md:text-center">
                            <p>
                                本院自 1982 年創立以來，始終秉持著「視病猶親」的核心精神，深耕社區，為在地居民提供最優質的醫療服務。
                                從初期的地區診所，逐步發展成為今日擁有完善設備與專業醫療團隊的現代化綜合醫院。
                            </p>
                            <p>
                                我們不僅追求醫療技術的精進，更重視醫療服務的人性化。透過引進先進儀器、延攬優秀專科醫師，
                                致力於建構一個讓病人安心、家屬放心的醫療環境。未來，我們將持續朝向智慧醫療與預防醫學發展，
                                成為守護您與家人健康的堅強後盾。
                            </p>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Core Values Section */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-6">
                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-3 gap-10"
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                    >
                        {/* Card 1 */}
                        <motion.div variants={fadeInUp} className="group p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:border-emerald-200 hover:shadow-xl transition-all duration-300">
                            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-6 text-emerald-600 group-hover:scale-110 transition-transform duration-300">
                                <Heart size={32} strokeWidth={2} />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-800 mb-4 group-hover:text-emerald-800 transition-colors">愛心關懷</h3>
                            <p className="text-slate-600 leading-relaxed">
                                以溫暖的態度對待每一位病患，傾聽需求，提供充滿同理心的照護，讓醫療不僅是治癒身體，更是撫慰心靈。
                            </p>
                        </motion.div>

                        {/* Card 2 */}
                        <motion.div variants={fadeInUp} className="group p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:border-emerald-200 hover:shadow-xl transition-all duration-300">
                            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-6 text-emerald-600 group-hover:scale-110 transition-transform duration-300">
                                <ShieldCheck size={32} strokeWidth={2} />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-800 mb-4 group-hover:text-emerald-800 transition-colors">專業信賴</h3>
                            <p className="text-slate-600 leading-relaxed">
                                嚴格把關醫療品質，持續進修精進醫術，結合尖端科技設備，提供精確可靠的診斷與治療方案。
                            </p>
                        </motion.div>

                        {/* Card 3 */}
                        <motion.div variants={fadeInUp} className="group p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:border-emerald-200 hover:shadow-xl transition-all duration-300">
                            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-6 text-emerald-600 group-hover:scale-110 transition-transform duration-300">
                                <Users size={32} strokeWidth={2} />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-800 mb-4 group-hover:text-emerald-800 transition-colors">社區服務</h3>
                            <p className="text-slate-600 leading-relaxed">
                                主動走入社區，舉辦衛教講座與義診活動，落實預防醫學，成為社區居民最值得信賴的健康好鄰居。
                            </p>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Superintendent Message Section */}
            <section className="py-20 bg-emerald-900/5 overflow-hidden">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-20">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="w-full md:w-1/2 relative"
                        >
                            <div className="aspect-[3/4] md:aspect-[4/5] relative rounded-2xl overflow-hidden shadow-2xl">
                                <Image
                                    src="/images/superintendent.png"
                                    alt="院長照片"
                                    fill
                                    className="object-cover hover:scale-105 transition-transform duration-700"
                                />
                            </div>
                            <div className="absolute -bottom-6 -right-6 md:-bottom-10 md:-right-10 bg-emerald-600 text-white p-6 md:p-8 rounded-xl shadow-lg animate-bounce-slow">
                                <p className="text-lg font-semibold">院長</p>
                                <p className="text-2xl md:text-3xl font-bold">李仁德 醫師</p>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="w-full md:w-1/2"
                        >
                            <h2 className="text-3xl md:text-4xl font-bold text-emerald-900 mb-8">
                                回歸醫療初心，守護生命價值
                            </h2>
                            <div className="text-lg text-slate-600 space-y-6 leading-relaxed">
                                <p>
                                    「醫療的本質，是人與人之間最真誠的關懷。」
                                </p>
                                <p>
                                    在這座醫院裡，我們不只治療疾病，更希望能治癒病人的心。每一位走進來的患者，都是我們的家人。
                                    我們期許自己能成為一道溫暖的光，照亮病痛中的幽谷，陪伴每一位患者重拾健康與笑容。
                                </p>
                                <p>
                                    這是我們全體同仁共同的承諾，也是我行醫自始至終不變的信念。感謝您將寶貴的健康託付給我們，
                                    我們定當全力以赴，不負所託。
                                </p>
                            </div>
                            <div className="mt-10 flex items-center space-x-4">
                                <div className="h-1 w-20 bg-emerald-500 rounded-full"></div>
                                <p className="text-emerald-800 font-serif text-2xl font-bold italic">Dr. Ren-De Li</p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-20 bg-emerald-900 text-white relative overflow-hidden">
                {/* Decorative BG pattern */}
                <div className="absolute top-0 left-0 w-full h-full text-emerald-800/10 opacity-20 pointer-events-none">
                    <Activity size={400} className="absolute -left-20 -top-20" />
                    <Award size={300} className="absolute top-1/2 right-10" />
                </div>

                <div className="container mx-auto px-6 relative z-10">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        {[
                            { number: "1982", label: "創立年份", icon: <Clock className="w-8 h-8 mb-2 opacity-80" /> },
                            { number: "20+", label: "專科門診", icon: <Award className="w-8 h-8 mb-2 opacity-80" /> },
                            { number: "50+", label: "專業醫師", icon: <UserCheck className="w-8 h-8 mb-2 opacity-80" /> },
                            { number: "24h", label: "急診照護", icon: <CheckCircle2 className="w-8 h-8 mb-2 opacity-80" /> }
                        ].map((stat, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.5 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="p-6"
                            >
                                <div className="flex flex-col items-center justify-center">
                                    {stat.icon}
                                    <div className="text-4xl md:text-6xl font-bold text-emerald-300 mb-2">{stat.number}</div>
                                    <div className="text-emerald-100 text-lg md:text-xl font-medium">{stat.label}</div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}

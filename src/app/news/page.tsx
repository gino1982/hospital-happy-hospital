"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, ChevronRight, Bell, Activity, Award, FileText, ArrowRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

// Mock Data
const newsData = [
    {
        id: 1,
        title: "本院榮獲 2024 年國家醫療品質獎銀獎",
        category: "honor",
        date: "2024-12-28",
        summary: "經過全體同仁的努力，好幸福醫院在醫療服務品質與病人安全領域表現卓越，榮獲國家級肯定。",
        image: "/images/bg-pattern.png" // Placeholder or CSS fallback
    },
    {
        id: 2,
        title: "114年春節連續假期門診時間公告",
        category: "announcement",
        date: "2024-12-25",
        summary: "春節期間（2/8-2/14）本院急診照常服務，門診時間有所異動，請民眾多加留意。",
        image: null
    },
    {
        id: 3,
        title: "冬季流感疫苗開打！符合資格者請儘速接種",
        category: "health",
        date: "2024-12-20",
        summary: "保護自己也保護家人，本院提供公費與自費流感疫苗接種服務，歡迎多加利用。",
        image: null
    },
    {
        id: 4,
        title: "引進最新一代 3D 乳房攝影儀，提升篩檢精準度",
        category: "announcement",
        date: "2024-12-15",
        summary: "為提供婦女更優質的健康照護，本院斥資引進高階影像設備，讓微小病灶無所遁形。",
        image: null
    },
    {
        id: 5,
        title: "產前遺傳診斷：準媽媽必知的關鍵檢查",
        category: "health",
        date: "2024-12-10",
        summary: "婦產科李宜明院長親自解說，羊膜穿刺與非侵入性胎兒染色體檢測（NIPT）的差異與選擇。",
        image: null
    },
    {
        id: 6,
        title: "狂賀！本院護理部獲選「友善職場」示範單位",
        category: "honor",
        date: "2024-12-05",
        summary: "我們重視每一位員工的幸福感，打造支持性工作環境，讓醫護人員能更專注於照護病人。",
        image: null
    }
];

const categories = [
    { id: "all", name: "全部消息", icon: Bell },
    { id: "announcement", name: "院內公告", icon: FileText },
    { id: "health", name: "衛教資訊", icon: Activity },
    { id: "honor", name: "榮譽榜", icon: Award },
];

export default function NewsPage() {
    const [activeCategory, setActiveCategory] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");

    const filteredNews = newsData.filter(item => {
        const matchesCategory = activeCategory === "all" || item.category === activeCategory;
        const matchesSearch = item.title.includes(searchQuery) || item.summary.includes(searchQuery);
        return matchesCategory && matchesSearch;
    });

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            {/* Hero Section */}
            <section className="relative py-24 overflow-hidden bg-emerald-900">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-950 to-emerald-900/90"></div>
                <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl"></div>
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.05)_1px,transparent_0)] bg-[length:40px_40px]"></div>

                <div className="container relative z-10 px-6 mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                    >
                        <Badge className="bg-emerald-500/20 text-emerald-100 border-emerald-500/30 mb-4 px-4 py-1.5 backdrop-blur-sm">
                            Latest News
                        </Badge>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
                            最新消息與公告
                        </h1>
                        <p className="text-emerald-100 text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed opacity-90">
                            掌握好幸福醫院的最新動態、門診異動公告以及專業的健康衛教資訊。
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Content Section */}
            <section className="py-16 -mt-10 relative z-20 px-6">
                <div className="container mx-auto max-w-6xl">

                    {/* Controls */}
                    <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-6 mb-12 border border-slate-100">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-6">

                            {/* Categories */}
                            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                                {categories.map((cat) => {
                                    const Icon = cat.icon;
                                    const isActive = activeCategory === cat.id;
                                    return (
                                        <button
                                            key={cat.id}
                                            onClick={() => setActiveCategory(cat.id)}
                                            className={`
                          flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300
                          ${isActive
                                                    ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20 transform scale-105"
                                                    : "bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900"}
                        `}
                                        >
                                            <Icon className="w-4 h-4" />
                                            {cat.name}
                                        </button>
                                    )
                                })}
                            </div>

                            {/* Search */}
                            <div className="relative w-full md:w-72">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                                <Input
                                    placeholder="搜尋消息..."
                                    className="pl-10 h-11 bg-slate-50 border-slate-200 focus:ring-emerald-500 focus:border-emerald-500 rounded-full"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* News Grid */}
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        key={activeCategory} // Force re-animate on switch
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        {filteredNews.length > 0 ? (
                            filteredNews.map((item) => (
                                <motion.div key={item.id} variants={itemVariants}>
                                    <Link href={`/news/${item.id}`} className="group block h-full">
                                        <Card className="h-full border-none shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden flex flex-col bg-white">
                                            <div className="h-2 bg-gradient-to-r from-emerald-400 to-teal-500" />
                                            <CardContent className="p-8 flex-1 flex flex-col">
                                                <div className="flex justify-between items-start mb-4">
                                                    <span className={`
                            px-3 py-1 rounded-md text-xs font-semibold uppercase tracking-wider
                            ${item.category === 'announcement' ? 'bg-blue-50 text-blue-600' :
                                                            item.category === 'health' ? 'bg-green-50 text-green-600' :
                                                                item.category === 'honor' ? 'bg-amber-50 text-amber-600' : 'bg-slate-100'}
                          `}>
                                                        {categories.find(c => c.id === item.category)?.name}
                                                    </span>
                                                    <span className="flex items-center text-slate-400 text-xs font-medium">
                                                        <Calendar className="w-3.5 h-3.5 mr-1" />
                                                        {item.date}
                                                    </span>
                                                </div>

                                                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-emerald-600 transition-colors line-clamp-2">
                                                    {item.title}
                                                </h3>

                                                <p className="text-slate-500 mb-6 text-sm leading-relaxed line-clamp-3">
                                                    {item.summary}
                                                </p>

                                                <div className="mt-auto flex items-center text-emerald-600 font-semibold text-sm group-hover:translate-x-2 transition-transform duration-300">
                                                    閱讀更多 <ArrowRight className="ml-2 w-4 h-4" />
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                </motion.div>
                            ))
                        ) : (
                            <motion.div variants={itemVariants} className="col-span-full py-12 text-center text-slate-500">
                                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                                    <Search className="w-8 h-8" />
                                </div>
                                <p className="text-lg">沒有找到相關文章</p>
                            </motion.div>
                        )}
                    </motion.div>

                </div>
            </section>
        </div>
    );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, Facebook, Instagram, Mail, MapPin, Phone } from "lucide-react";

export function Footer() {
    const pathname = usePathname();
    const isAdmin = pathname?.startsWith("/admin");

    if (isAdmin) return null;

    return (
        <footer className="bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 pt-16 pb-8">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* Brand */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
                                <Activity className="w-5 h-5" />
                            </div>
                            <span className="text-xl font-bold text-slate-800 dark:text-white">好幸福醫院</span>
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                            致力於提供最優質的醫療服務，守護您與家人的健康。我們引進先進設備，網羅專業醫療團隊，為您打造溫馨舒適的就醫環境。
                        </p>
                        <div className="flex gap-4">
                            <Link href="#" className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-600 hover:bg-primary hover:text-white transition-colors">
                                <Facebook className="w-4 h-4" />
                            </Link>
                            <Link href="#" className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-600 hover:bg-primary hover:text-white transition-colors">
                                <Instagram className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-bold text-slate-800 dark:text-white mb-6">快速連結</h3>
                        <ul className="space-y-3">
                            <li><Link href="/about" className="text-slate-500 hover:text-primary text-sm transition-colors">關於本院</Link></li>
                            <li><Link href="/doctors" className="text-slate-500 hover:text-primary text-sm transition-colors">醫療團隊</Link></li>
                            <li><Link href="/schedule" className="text-slate-500 hover:text-primary text-sm transition-colors">門診時刻</Link></li>
                            <li><Link href="/register" className="text-slate-500 hover:text-primary text-sm transition-colors">線上掛號</Link></li>
                            <li><Link href="/news" className="text-slate-500 hover:text-primary text-sm transition-colors">衛教資訊</Link></li>
                        </ul>
                    </div>

                    {/* Departments */}
                    <div>
                        <h3 className="font-bold text-slate-800 dark:text-white mb-6">重點科別</h3>
                        <ul className="space-y-3">
                            <li><Link href="/doctors?dept=obgyn" className="text-slate-500 hover:text-primary text-sm transition-colors">婦產科</Link></li>
                            <li><Link href="/doctors?dept=pediatrics" className="text-slate-500 hover:text-primary text-sm transition-colors">小兒科</Link></li>
                            <li><Link href="/doctors?dept=surgery" className="text-slate-500 hover:text-primary text-sm transition-colors">乳房外科</Link></li>
                            <li><Link href="/doctors?dept=internal" className="text-slate-500 hover:text-primary text-sm transition-colors">一般內科</Link></li>
                            <li><Link href="/doctors?dept=center" className="text-slate-500 hover:text-primary text-sm transition-colors">腹腔鏡手術中心</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="font-bold text-slate-800 dark:text-white mb-6">聯絡資訊</h3>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                                <span className="text-slate-500 text-sm">幸福市幸福路777號</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="w-5 h-5 text-primary shrink-0" />
                                <span className="text-slate-500 text-sm">(07)-5555777</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="w-5 h-5 text-primary shrink-0" />
                                <span className="text-slate-500 text-sm">service@haoxinfu.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-slate-200 dark:border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-slate-400 text-xs">
                        © {new Date().getFullYear()} 好幸福醫院 Hao Xingfu Hospital. All rights reserved.
                    </p>
                    <div className="flex gap-6">
                        <Link href="#" className="text-slate-400 text-xs hover:text-primary">隱私權政策</Link>
                        <Link href="#" className="text-slate-400 text-xs hover:text-primary">網站使用條款</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}

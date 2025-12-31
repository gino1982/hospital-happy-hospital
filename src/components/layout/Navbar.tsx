"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Menu, X, Stethoscope, Calendar, Phone, Activity, User } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";

const navItems = [
    { name: "關於本院", href: "/about" },
    { name: "醫師團隊", href: "/doctors" },
    { name: "門診時刻", href: "/schedule" },
    { name: "線上掛號", href: "/register", highlight: true },
    { name: "最新消息", href: "/news" },
];

export function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const { scrollY } = useScroll();
    const pathname = usePathname();

    useMotionValueEvent(scrollY, "change", (latest) => {
        setIsScrolled(latest > 50);
    });

    const isHome = pathname === "/";
    const isAdmin = pathname?.startsWith("/admin");

    if (isAdmin) return null;

    return (
        <motion.header
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
                isScrolled || !isHome
                    ? "bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-sm border-b border-gray-100 dark:border-gray-800 py-3"
                    : "bg-white/20 dark:bg-slate-900/20 backdrop-blur-sm py-5"
            )}
        >
            <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform">
                        <Activity className="w-6 h-6" />
                    </div>
                    <div className="flex flex-col">
                        <span className={cn(
                            "text-xl font-bold tracking-tight transition-colors",
                            isScrolled || !isHome ? "text-slate-800 dark:text-white" : "text-slate-800 dark:text-white" // Always dark/white unless on dark bg hero? Assuming light hero for now
                        )}>
                            好幸福醫院
                        </span>
                        <span className="text-[10px] uppercase tracking-wider text-slate-500 font-medium">
                            Hao Xingfu Hospital
                        </span>
                    </div>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-8">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            prefetch={false}
                            className={cn(
                                "text-sm font-medium transition-colors hover:text-primary relative group",
                                item.highlight
                                    ? ""
                                    : isScrolled || !isHome ? "text-slate-600 dark:text-slate-300" : "text-slate-700 dark:text-slate-200"
                            )}
                        >
                            {item.name}
                            {!item.highlight && (
                                <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
                            )}
                        </Link>
                    ))}

                    <Link href="/register" prefetch={false}>
                        <Button
                            size="sm"
                            className={cn(
                                "rounded-full px-6 shadow-md hover:shadow-lg transition-all",
                                isScrolled ? "" : "bg-primary/90 hover:bg-primary"
                            )}
                        >
                            立即掛號
                        </Button>
                    </Link>

                    {/* Admin Link (Subtle) */}
                    <Link href="/admin" prefetch={false}>
                        <Button variant="ghost" size="icon" className="text-slate-400 hover:text-primary">
                            <User className="w-4 h-4" />
                        </Button>
                    </Link>
                </nav>

                {/* Mobile Menu */}
                <div className="md:hidden">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-slate-700">
                                <Menu className="w-6 h-6" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                            <div className="flex flex-col gap-6 mt-10">
                                <Link href="/" className="flex items-center gap-2 mb-4">
                                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
                                        <Activity className="w-5 h-5" />
                                    </div>
                                    <span className="text-lg font-bold">好幸福醫院</span>
                                </Link>
                                {navItems.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        prefetch={false}
                                        className="text-lg font-medium text-slate-700 dark:text-slate-200 hover:text-primary transition-colors flex items-center justify-between border-b border-gray-100 pb-3"
                                    >
                                        {item.name}
                                        {item.highlight && <Calendar className="w-4 h-4 text-primary" />}
                                    </Link>
                                ))}

                                <Link href="/admin" prefetch={false} className="mt-4">
                                    <Button variant="outline" className="w-full">
                                        管理後台
                                    </Button>
                                </Link>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </motion.header>
    );
}

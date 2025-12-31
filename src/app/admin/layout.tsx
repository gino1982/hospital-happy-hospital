"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { LayoutDashboard, Users, Calendar, Settings, Home, Menu, Activity, LogOut } from "lucide-react";

const sidebarItems = [
    { name: "儀表板", href: "/admin", icon: LayoutDashboard },
    { name: "醫師管理", href: "/admin/doctors", icon: Users },
    { name: "門診排程", href: "/admin/schedule", icon: Calendar },
    { name: "系統設定", href: "/admin/settings", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    const isLogin = pathname === "/admin/login";

    const handleLogout = async () => {
        await fetch("/api/admin/logout", { method: "POST" });
        window.location.href = "/admin/login";
    };

    if (isLogin) {
        return <div className="min-h-screen bg-slate-50">{children}</div>;
    }

    return (
        <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900">
            {/* Desktop Sidebar */}
            <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 fixed h-full z-20">
                <div className="p-6 flex items-center gap-3 border-b border-slate-100 dark:border-slate-800">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
                        <Activity className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-lg text-slate-800 dark:text-white">後台管理系統</span>
                </div>

                <div className="flex-1 py-6 px-4 space-y-1">
                    {sidebarItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link key={item.href} href={item.href}>
                                <Button
                                    variant={isActive ? "secondary" : "ghost"}
                                    className={cn(
                                        "w-full justify-start gap-3 mb-1",
                                        isActive ? "bg-primary/10 text-primary hover:bg-primary/20" : "text-slate-500 hover:text-primary"
                                    )}
                                >
                                    <item.icon className="w-5 h-5" />
                                    {item.name}
                                </Button>
                            </Link>
                        );
                    })}
                </div>

                <div className="p-4 border-t border-slate-100 dark:border-slate-800">
                    <Button variant="ghost" className="w-full justify-start gap-2 text-slate-500 hover:text-primary" onClick={handleLogout}>
                        <LogOut className="w-4 h-4" />
                        登出
                    </Button>
                    <Link href="/">
                        <Button variant="outline" className="w-full gap-2 border-slate-200 text-slate-600">
                            <Home className="w-4 h-4" />
                            返回前台
                        </Button>
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
                {/* Mobile Header */}
                <header className="md:hidden h-16 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 sticky top-0 z-10">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
                            <Activity className="w-5 h-5" />
                        </div>
                        <span className="font-bold text-lg">後台管理</span>
                    </div>

                    <Sheet open={isOpen} onOpenChange={setIsOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <Menu className="w-6 h-6" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-64 p-0">
                            <div className="p-6 flex items-center gap-3 border-b border-slate-100">
                                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
                                    <Activity className="w-5 h-5" />
                                </div>
                                <span className="font-bold text-lg">後台管理系統</span>
                            </div>
                            <div className="py-6 px-4 space-y-1">
                                {sidebarItems.map((item) => {
                                    const isActive = pathname === item.href;
                                    return (
                                        <Link key={item.href} href={item.href} onClick={() => setIsOpen(false)}>
                                            <Button
                                                variant={isActive ? "secondary" : "ghost"}
                                                className={cn(
                                                    "w-full justify-start gap-3 mb-1",
                                                    isActive ? "bg-primary/10 text-primary" : "text-slate-500 hover:text-primary"
                                                )}
                                            >
                                                <item.icon className="w-5 h-5" />
                                                {item.name}
                                            </Button>
                                        </Link>
                                    );
                                })}
                                <div className="pt-4 mt-4 border-t border-slate-100">
                                    <Link href="/" onClick={() => setIsOpen(false)}>
                                        <Button variant="outline" className="w-full gap-2">
                                            <Home className="w-4 h-4" />
                                            返回前台
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-4 md:p-8 overflow-y-auto">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}

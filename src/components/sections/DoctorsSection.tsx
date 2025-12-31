"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useHospital } from "@/lib/store";

export function DoctorsSection() {
    const { doctors } = useHospital();

    return (
        <section className="py-24 bg-white overflow-hidden relative">
            <div className="absolute top-0 left-0 w-1/3 h-full bg-slate-50 skew-x-12 -ml-24 z-0 hidden lg:block" />

            <div className="container relative z-10 px-6">
                <div className="flex flex-col lg:flex-row items-center gap-16">

                    {/* Left Content */}
                    <div className="lg:w-1/3">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <span className="text-emerald-600 font-bold tracking-wider uppercase text-sm">Medical Team</span>
                            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mt-3 mb-6">優質醫療團隊</h2>
                            <p className="text-slate-600 text-lg leading-relaxed mb-8">
                                我們匯聚了各專科領域的權威醫師，每一位都具備豐富的臨床經驗與專業認證，提供您最值得信賴的醫療品質。
                            </p>

                            <div className="hidden lg:block relative h-64 w-full rounded-2xl overflow-hidden shadow-lg mt-8">
                                <Image
                                    src="/images/medical-team.png"
                                    alt="Medical Team"
                                    fill
                                    className="object-cover"
                                    loading="lazy"
                                    placeholder="blur"
                                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAUH/8QAIhAAAgEDAwUBAAAAAAAAAAAAAQIDAAQRBQYhEhMxQVFh/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAZEQACAwEAAAAAAAAAAAAAAAABAgADESH/2gAMAwEAAhEDEQA/ANI3Dv8A0+x7e3uLq0uJYriUxKY2UYyATnJ+VVpN9aVJGsjW94VYAj9X5SlTVi7E5Jz/2Q=="
                                    quality={75}
                                    sizes="(max-width: 768px) 100vw, 33vw"
                                />
                                <div className="absolute inset-0 bg-emerald-900/20" />
                            </div>

                            <Link href="/doctors" prefetch={false}>
                                <Button size="lg" className="hidden lg:flex mt-8 rounded-full bg-slate-900 text-white hover:bg-emerald-600 transition-colors px-8 h-12">
                                    查看所有醫師 <ArrowRight className="ml-2 w-4 h-4" />
                                </Button>
                            </Link>
                        </motion.div>
                    </div>

                    {/* Right Grid */}
                    <div className="lg:w-2/3 w-full">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {doctors.slice(0, 4).map((doctor, index) => (
                                <motion.div
                                    key={doctor.id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                    className="group"
                                >
                                    <div className="relative rounded-2xl overflow-hidden aspect-[4/5] bg-slate-100 shadow-md hover:shadow-xl transition-all duration-500">
                                        <Image
                                            src={doctor.imageUrl}
                                            alt={doctor.name}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                                            loading="lazy"
                                            quality={70}
                                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-80" />

                                        <div className="absolute bottom-0 left-0 right-0 p-6 z-10 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                            <div className="inline-block px-3 py-1 bg-emerald-500/90 backdrop-blur-sm text-white text-xs font-semibold rounded-full mb-3">
                                                {doctor.title}
                                            </div>
                                            <h3 className="text-2xl font-bold text-white mb-2">{doctor.name} <span className="text-base font-normal opacity-80">醫師</span></h3>
                                            <p className="text-slate-300 text-sm line-clamp-2 opacity-0 group-hover:opacity-100 transition-all duration-300 delay-100 mb-2">
                                                {doctor.introduction}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <div className="mt-8 text-center lg:hidden">
                            <Link href="/doctors" prefetch={false}>
                                <Button size="lg" variant="outline" className="w-full rounded-full border-slate-300">
                                    查看所有醫師 <ArrowRight className="ml-2 w-4 h-4" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

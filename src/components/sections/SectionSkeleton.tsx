export function DepartmentsSkeleton() {
    return (
        <section className="py-20 bg-slate-50">
            <div className="container mx-auto px-6">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <div className="h-4 w-24 bg-slate-200 rounded mx-auto mb-4 animate-pulse" />
                    <div className="h-10 w-72 bg-slate-200 rounded mx-auto mb-6 animate-pulse" />
                    <div className="w-20 h-1.5 bg-slate-200 mx-auto rounded-full mb-6" />
                    <div className="h-6 w-96 bg-slate-200 rounded mx-auto animate-pulse" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 h-64 animate-pulse">
                            <div className="w-12 h-12 bg-slate-200 rounded-xl mb-6" />
                            <div className="h-6 w-24 bg-slate-200 rounded mb-3" />
                            <div className="h-4 w-full bg-slate-200 rounded mb-2" />
                            <div className="h-4 w-3/4 bg-slate-200 rounded" />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export function DoctorsSkeleton() {
    return (
        <section className="py-24 bg-white">
            <div className="container px-6">
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    <div className="lg:w-1/3">
                        <div className="h-4 w-24 bg-slate-200 rounded mb-4 animate-pulse" />
                        <div className="h-10 w-48 bg-slate-200 rounded mb-6 animate-pulse" />
                        <div className="h-24 w-full bg-slate-200 rounded animate-pulse" />
                    </div>
                    <div className="lg:w-2/3 w-full">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="aspect-[4/5] bg-slate-200 rounded-2xl animate-pulse" />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export function CTASkeleton() {
    return (
        <section className="py-24 bg-emerald-900">
            <div className="container px-6 text-center">
                <div className="max-w-3xl mx-auto">
                    <div className="h-12 w-96 bg-emerald-800 rounded mx-auto mb-6 animate-pulse" />
                    <div className="h-6 w-full bg-emerald-800 rounded mx-auto mb-12 animate-pulse" />
                    <div className="flex justify-center gap-6">
                        <div className="h-16 w-48 bg-emerald-800 rounded-full animate-pulse" />
                        <div className="h-16 w-64 bg-emerald-800 rounded-full animate-pulse" />
                    </div>
                </div>
            </div>
        </section>
    );
}

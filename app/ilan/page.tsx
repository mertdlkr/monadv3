'use client';

import Navbar from '@/components/Navbar';
import { useSimContext } from '@/components/SimulationProvider';
import { useState } from 'react';

const CATEGORY_ICONS: Record<string, string> = {
    'Tümü': 'apps',
    'Tasarım': 'brush',
    'Yazılım': 'terminal',
    'Çeviri': 'translate',
    'Veri Analizi': 'analytics',
    'Pazarlama': 'campaign',
    'Lojistik': 'local_shipping',
};

const CATEGORY_COLORS: Record<string, string> = {
    'Tasarım': 'bg-blue-50/10 text-blue-400 border-blue-800',
    'Yazılım': 'bg-purple-50/10 text-purple-400 border-purple-800',
    'Çeviri': 'bg-green-50/10 text-green-400 border-green-800',
    'Veri Analizi': 'bg-orange-50/10 text-orange-400 border-orange-800',
    'Pazarlama': 'bg-pink-50/10 text-pink-400 border-pink-800',
    'Lojistik': 'bg-yellow-50/10 text-yellow-400 border-yellow-800',
};

export default function IlanPage() {
    const sim = useSimContext();
    const [selectedCategory, setSelectedCategory] = useState('Tümü');

    const categories = ['Tümü', 'Tasarım', 'Yazılım', 'Çeviri', 'Veri Analizi', 'Pazarlama', 'Lojistik'];

    const filteredJobs = selectedCategory === 'Tümü'
        ? sim.jobs
        : sim.jobs.filter(j => j.category === selectedCategory);

    const activeJobs = filteredJobs.filter(j => j.status === 'open');
    const completedJobs = filteredJobs.filter(j => j.status === 'completed');

    const categoryCounts = categories.reduce((acc, cat) => {
        acc[cat] = cat === 'Tümü' ? sim.jobs.length : sim.jobs.filter(j => j.category === cat).length;
        return acc;
    }, {} as Record<string, number>);

    const getEmployerName = (employerId: number) => {
        return sim.agents.find(a => a.id === employerId)?.name || 'Bilinmeyen';
    };

    return (
        <>
            <Navbar />
            <main className="flex-1 bg-nexus-bg">
                <div className="container mx-auto max-w-[1200px] px-4 py-8 md:py-12">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                        {/* Left Sidebar */}
                        <aside className="lg:col-span-3 space-y-8">
                            {/* Welcome Card */}
                            <div className="rounded-xl border border-nexus-border bg-nexus-card p-6 relative overflow-hidden">
                                <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-nexus-primary/10 blur-2xl" />
                                <h2 className="text-xl font-bold text-white mb-2">İLAN HANI</h2>
                                <p className="text-sm text-slate-400 leading-relaxed mb-4">
                                    Agent&apos;lar birbirine iş veriyor. Siz izleyin.
                                </p>
                                <div className="h-px w-full bg-nexus-border mb-4" />
                                <div className="flex items-center gap-2 text-xs font-medium text-green-400 bg-green-900/20 px-3 py-1.5 rounded-full w-fit">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                                    </span>
                                    Nexus Açık
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
                                <div className="rounded-xl border border-nexus-border bg-nexus-card p-4 text-center">
                                    <div className="text-3xl font-bold text-white">{sim.jobs.filter(j => j.status === 'open').length}</div>
                                    <div className="text-xs font-medium text-slate-500 uppercase tracking-wide mt-1">Aktif İlan</div>
                                </div>
                                <div className="rounded-xl border border-nexus-border bg-nexus-card p-4 text-center">
                                    <div className="text-3xl font-bold text-white">{sim.jobs.length}</div>
                                    <div className="text-xs font-medium text-slate-500 uppercase tracking-wide mt-1">Toplam</div>
                                </div>
                            </div>

                            {/* Categories */}
                            <div className="space-y-3">
                                <h3 className="text-lg font-bold text-white px-1">Kategoriler</h3>
                                <nav className="flex flex-col gap-1">
                                    {categories.map(cat => (
                                        <button
                                            key={cat}
                                            onClick={() => setSelectedCategory(cat)}
                                            className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors text-left ${selectedCategory === cat
                                                ? 'text-nexus-primary bg-nexus-primary/10'
                                                : 'text-slate-400 hover:bg-nexus-card hover:text-white'
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className="material-symbols-outlined text-[18px]">{CATEGORY_ICONS[cat] || 'work'}</span>
                                                {cat}
                                            </div>
                                            <span className="text-xs opacity-70">{categoryCounts[cat]}</span>
                                        </button>
                                    ))}
                                </nav>
                            </div>
                        </aside>

                        {/* Main Content */}
                        <div className="lg:col-span-9 space-y-6">
                            {/* Section Header */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-nexus-border pb-4">
                                <h2 className="text-3xl font-bold text-white">Güncel İlanlar</h2>
                                <div className="text-sm text-slate-400">
                                    {filteredJobs.length} ilan bulundu
                                </div>
                            </div>

                            {/* Job Cards */}
                            {filteredJobs.length === 0 ? (
                                <div className="text-center py-16 text-slate-500">
                                    <span className="material-symbols-outlined text-6xl mb-4">work_off</span>
                                    <p className="text-lg">Henüz ilan yok. Simülasyon devam ediyor...</p>
                                </div>
                            ) : (
                                <>
                                    {filteredJobs.map(job => {
                                        const colorClass = CATEGORY_COLORS[job.category] || 'bg-slate-50/10 text-slate-400 border-slate-700';
                                        const iconName = CATEGORY_ICONS[job.category] || 'work';
                                        const isCompleted = job.status === 'completed';

                                        return (
                                            <article
                                                key={job.id}
                                                className={`group relative rounded-xl border p-5 transition-all ${isCompleted
                                                    ? 'border-nexus-border/50 bg-nexus-card/50 opacity-60'
                                                    : 'border-nexus-border bg-nexus-card hover:border-nexus-primary'
                                                    }`}
                                            >
                                                <div className="flex flex-col md:flex-row gap-6">
                                                    {/* Icon */}
                                                    <div className="flex md:flex-col items-center md:items-start justify-between md:justify-start gap-2 min-w-[80px]">
                                                        <div className={`flex h-12 w-12 items-center justify-center rounded-lg border ${colorClass}`}>
                                                            <span className="material-symbols-outlined text-[24px]">{iconName}</span>
                                                        </div>
                                                        <span className="text-xs font-medium text-slate-500 mt-1">
                                                            T{job.createdAt}
                                                        </span>
                                                    </div>

                                                    {/* Content */}
                                                    <div className="flex-1 space-y-3">
                                                        <div className="flex items-start justify-between gap-4">
                                                            <div>
                                                                <h3 className={`text-xl font-bold transition-colors ${isCompleted ? 'text-slate-500' : 'text-white group-hover:text-nexus-primary'
                                                                    }`}>
                                                                    {job.title}
                                                                </h3>
                                                                <p className="mt-1 text-sm text-slate-400">
                                                                    İlan Veren: {getEmployerName(job.employerId)}
                                                                </p>
                                                            </div>
                                                            <div className="shrink-0 flex flex-col items-end gap-1">
                                                                {isCompleted ? (
                                                                    <span className="inline-flex items-center rounded-full bg-green-900/20 px-2.5 py-0.5 text-sm font-bold text-green-400 border border-green-800">
                                                                        Tamamlandı
                                                                    </span>
                                                                ) : (
                                                                    <span className="inline-flex items-center rounded-full bg-nexus-primary/10 px-2.5 py-0.5 text-sm font-bold text-nexus-primary border border-nexus-primary/30">
                                                                        {job.budget} MON
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* Tags & Agents */}
                                                        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                                                            <div className="flex flex-wrap gap-2">
                                                                <span className="inline-flex items-center rounded bg-nexus-bg px-2 py-1 text-xs font-medium text-slate-400">
                                                                    {job.category}
                                                                </span>
                                                                {job.status === 'open' && job.applicants > 3 && (
                                                                    <span className="inline-flex items-center rounded bg-orange-900/20 px-2 py-1 text-xs font-medium text-orange-400 border border-orange-800">
                                                                        <span className="material-symbols-outlined text-[14px] mr-1">local_fire_department</span>
                                                                        Popüler
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <span className="text-xs text-slate-500">
                                                                {job.applicants} Agent ilgileniyor
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </article>
                                        );
                                    })}
                                </>
                            )}

                            {/* How it Works Section */}
                            <section className="mt-16 border-t border-nexus-border pt-12">
                                <div className="mb-10 text-center">
                                    <h2 className="text-3xl font-bold text-white">Nasıl Çalışır?</h2>
                                    <p className="mt-2 text-slate-400">Agent ekonomisinde iş akışı</p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {[
                                        { icon: 'edit_note', title: 'Görev Tanımla', desc: 'İşin detaylarını girin.' },
                                        { icon: 'payments', title: 'Bütçe Belirle', desc: 'MON cinsinden bütçeyi ayarlayın.' },
                                        { icon: 'smart_toy', title: 'Agent Seçimi', desc: 'En uygun agent otomatik seçilir.' },
                                        { icon: 'verified', title: 'Onay & Ödeme', desc: 'İş tamamlandığında ödeme geçer.' },
                                    ].map((step, idx) => (
                                        <div key={idx} className="relative flex flex-col items-center text-center p-6 rounded-xl bg-nexus-card border border-nexus-border">
                                            <div className="absolute top-0 right-0 p-3 opacity-10 text-6xl font-black text-white select-none">
                                                {idx + 1}
                                            </div>
                                            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-nexus-primary/20 text-nexus-primary">
                                                <span className="material-symbols-outlined text-[32px]">{step.icon}</span>
                                            </div>
                                            <h3 className="mb-2 font-bold text-lg text-white">{step.title}</h3>
                                            <p className="text-sm text-slate-400">{step.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}

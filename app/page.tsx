'use client';

import Navbar from '@/components/Navbar';
import { useSimContext } from '@/components/SimulationProvider';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, ReferenceLine
} from 'recharts';

const EVENT_TYPE_EMOJI: Record<string, string> = {
    trade: '💰', scam: '🚨', cartel: '🤝', bankruptcy: '💀',
    zabita: '👮', guild: '⚔️', monopoly: '👑', ilan: '📋', fight: '🥊'
};

function getGiniColor(gini: number): string {
    if (gini < 0.3) return '#00ff88';
    if (gini < 0.45) return '#ffd700';
    if (gini < 0.6) return '#ff6b35';
    return '#ff2d55';
}

function getGiniLabel(gini: number): string {
    if (gini < 0.3) return 'NORMAL';
    if (gini < 0.45) return 'DİKKAT';
    if (gini < 0.6) return 'TEHLİKE';
    return 'OLİGARŞİ ⚠️';
}

import NewsTicker from '@/components/NewsTicker';

export default function HomePage() {
    const sim = useSimContext();

    const giniData = sim.giniHistory.map((g) => ({ tick: g.tick, gini: Number(g.value.toFixed(3)) }));

    const featureCards = [
        {
            href: '/market',
            title: 'Nexus Haritası 🦀',
            desc: 'Tüm agent\'ları keşfet',
            icon: 'storefront',
        },
        {
            href: '/gazette',
            title: 'Nexus Gazetesi 📰',
            desc: 'Canlı ekonomi haberleri',
            icon: 'newspaper',
        },
        {
            href: '/ilan',
            title: 'İlan Hanı 📋',
            desc: 'İş kontratları & görevler',
            icon: 'assignment',
        },
    ];

    return (
        <>
            <Navbar />

            <NewsTicker events={sim.events} />

            <main className="flex-grow container mx-auto px-4 py-12 max-w-7xl">
                {/* HERO SECTION */}
                <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
                    <div className="space-y-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-nexus-primary/20 border border-nexus-primary text-nexus-primary text-xs font-bold font-mono tracking-widest uppercase mb-2">
                            <span className="w-2 h-2 rounded-full bg-nexus-primary animate-pulse" />
                            Live Simulation v2.0
                        </div>
                        <h1 className="text-5xl md:text-7xl font-pixel text-white drop-shadow-[4px_4px_0_#00ff88] leading-tight">
                            NEXUS
                        </h1>
                        <h2 className="text-2xl md:text-3xl font-grotesk font-light text-slate-200">
                            İlk Yapay Zeka Ekonomisi
                        </h2>
                        <p className="text-lg text-slate-400 italic border-l-4 border-nexus-primary/50 pl-4 py-1">
                            &quot;Ajanlara para, piyasa ve özgürlük verdik. Sonra sadece izledik.&quot;
                        </p>
                        <div className="flex flex-wrap gap-4 pt-4">
                            <Link
                                href="/market"
                                className="flex items-center justify-center gap-2 bg-nexus-primary text-black font-bold font-pixel text-xs px-8 py-4 rounded hover:bg-white hover:shadow-neon transition-all duration-300"
                            >
                                SİMÜLASYONA GİRİŞ
                                <span className="material-symbols-outlined">login</span>
                            </Link>
                        </div>
                    </div>

                    {/* Hero Visual */}
                    <div className="relative flex justify-center items-center">
                        <div className="absolute w-64 h-64 bg-nexus-primary/20 rounded-full blur-[60px] animate-pulse" />
                        <div className="relative z-10 p-4 border-4 border-nexus-primary bg-nexus-card rounded-xl shadow-neon w-full max-w-md aspect-video flex flex-col items-center justify-center text-center group overflow-hidden">
                            <Image
                                src="/hero_photo.png"
                                alt="NEXUS Hero"
                                fill
                                className="object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-nexus-bg via-transparent to-transparent" />
                            <div className="relative z-10 flex flex-col items-center mt-auto pb-4">
                                <p className="font-terminal text-2xl text-nexus-primary animate-pulse">
                                    {sim.agents.filter(a => !a.isBankrupt).length} agent aktif
                                </p>
                            </div>
                            {/* Decorative borders */}
                            <div className="absolute top-0 left-0 w-full h-1 bg-nexus-primary/50" />
                            <div className="absolute bottom-0 left-0 w-full h-1 bg-nexus-primary/50" />
                            <div className="absolute top-0 left-0 h-full w-1 bg-nexus-primary/50" />
                            <div className="absolute top-0 right-0 h-full w-1 bg-nexus-primary/50" />
                        </div>
                    </div>
                </div>

                {/* STAT CARDS */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                    {/* Card 1: Active Agents */}
                    <div className="bg-nexus-card border-2 border-nexus-primary p-6 rounded-lg pixel-shadow transition-all">
                        <div className="flex justify-between items-start mb-2">
                            <p className="font-terminal text-xl text-slate-400">Aktif Ajanlar</p>
                            <span className="material-symbols-outlined text-nexus-primary">smart_toy</span>
                        </div>
                        <p className="text-3xl font-pixel text-white mt-1">
                            {sim.agents.filter(a => !a.isBankrupt).length}{' '}
                            <span className="text-sm align-middle text-nexus-primary">Tüccar</span>
                        </p>
                    </div>

                    {/* Card 2: Throughput */}
                    <div className="bg-nexus-card border-2 border-nexus-primary p-6 rounded-lg pixel-shadow transition-all">
                        <div className="flex justify-between items-start mb-2">
                            <p className="font-terminal text-xl text-slate-400">İşlem Hacmi</p>
                            <span className="material-symbols-outlined text-nexus-primary">swap_horiz</span>
                        </div>
                        <p className="text-3xl font-pixel text-nexus-gold mt-1">
                            {sim.totalTrades}{' '}
                            <span className="text-sm align-middle text-slate-400">İşlem</span>
                        </p>
                    </div>

                    {/* Card 3: Gini */}
                    <div className="bg-nexus-card border-2 p-6 rounded-lg pixel-shadow transition-all" style={{ borderColor: getGiniColor(sim.currentGini) }}>
                        <div className="flex justify-between items-start mb-2">
                            <p className="font-terminal text-xl text-slate-400">Gini Katsayısı</p>
                            <span className="material-symbols-outlined" style={{ color: getGiniColor(sim.currentGini) }}>trending_up</span>
                        </div>
                        <p className="text-3xl font-pixel mt-1" style={{ color: getGiniColor(sim.currentGini) }}>
                            {sim.currentGini.toFixed(2)}{' '}
                            <span className="text-[10px] align-middle text-slate-400 ml-1">
                                {getGiniLabel(sim.currentGini)}
                            </span>
                        </p>
                    </div>

                    {/* Card 4: Bankruptcies */}
                    <div className="bg-nexus-card border-2 border-slate-700 p-6 rounded-lg pixel-shadow transition-all">
                        <div className="flex justify-between items-start mb-2">
                            <p className="font-terminal text-xl text-slate-400">Batan Dükkanlar</p>
                            <span className="material-symbols-outlined text-slate-500">skull</span>
                        </div>
                        <p className="text-3xl font-pixel text-[#ff2d55] mt-1">
                            {sim.totalBankruptcies}{' '}
                            <span className="text-sm align-middle text-slate-500">İflas 💀</span>
                        </p>
                    </div>
                </div>

                {/* MAIN DASHBOARD GRID */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* LEFT: Feature Cards */}
                    <div className="flex flex-col gap-6">
                        <h3 className="text-2xl font-pixel text-white mb-2 flex items-center gap-2">
                            <span className="material-symbols-outlined text-nexus-primary">category</span>
                            MEKANLAR
                        </h3>
                        {featureCards.map(card => (
                            <Link
                                key={card.href}
                                href={card.href}
                                className="group relative bg-nexus-card border border-slate-700 hover:border-nexus-primary p-6 rounded-xl overflow-hidden transition-all duration-300"
                            >
                                <div className="absolute inset-0 bg-nexus-primary/5 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500" />
                                <div className="relative z-10 flex justify-between items-center">
                                    <div>
                                        <h4 className="text-xl font-bold text-white group-hover:text-nexus-primary font-pixel text-xs mb-1">
                                            {card.title}
                                        </h4>
                                        <p className="text-sm text-slate-400">{card.desc}</p>
                                    </div>
                                    <span className="material-symbols-outlined text-4xl text-slate-600 group-hover:text-nexus-primary transition-colors">
                                        {card.icon}
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* RIGHT: GINI CHART */}
                    <div className="lg:col-span-2 flex flex-col">
                        <h3 className="text-2xl font-pixel text-white mb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined text-nexus-primary">ssid_chart</span>
                            SERVET EŞİTSİZLİĞİ
                        </h3>
                        <div className="bg-nexus-card border border-slate-700 rounded-xl p-6 flex-grow flex flex-col relative overflow-hidden">
                            <div className="flex justify-between items-center mb-4">
                                <h4 className="text-lg font-terminal text-slate-300">Gini Eğrisi — Canlı</h4>
                                <div className="flex gap-2">
                                    <span className="px-2 py-1 text-xs bg-nexus-primary text-black rounded font-bold">CANLI</span>
                                </div>
                            </div>
                            <div className="flex-grow min-h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={giniData}>
                                        <defs>
                                            <linearGradient id="giniGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="#ff2d55" />
                                                <stop offset="41%" stopColor="#ff6b35" />
                                                <stop offset="100%" stopColor="#00ff88" />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#1e1e3a" />
                                        <XAxis dataKey="tick" stroke="#4a4a6a" tick={{ fontSize: 10 }} />
                                        <YAxis domain={[0, 1]} stroke="#4a4a6a" tick={{ fontSize: 10 }} />
                                        <Tooltip
                                            contentStyle={{
                                                background: '#141428',
                                                border: '1px solid #00ff88',
                                                borderRadius: 8,
                                                color: '#e0e0e0',
                                            }}
                                        />
                                        <ReferenceLine y={0.28} stroke="#00ff88" strokeDasharray="5 5" label={{ value: 'DNM: 0.28', fill: '#00ff88', fontSize: 10, position: 'insideTopLeft' }} />
                                        <ReferenceLine y={0.41} stroke="#ffd700" strokeDasharray="5 5" label={{ value: 'TR: 0.41', fill: '#ffd700', fontSize: 10, position: 'insideTopLeft' }} />
                                        <ReferenceLine y={0.48} stroke="#ff6b35" strokeDasharray="5 5" label={{ value: 'ABD: 0.48', fill: '#ff6b35', fontSize: 10, position: 'insideTopLeft' }} />
                                        <ReferenceLine y={0.63} stroke="#ff2d55" strokeDasharray="5 5" label={{ value: 'BRE: 0.63', fill: '#ff2d55', fontSize: 10, position: 'insideTopLeft' }} />
                                        <Line
                                            type="monotone"
                                            dataKey="gini"
                                            stroke="url(#giniGradient)"
                                            strokeWidth={3}
                                            dot={false}
                                            activeDot={{ r: 4, fill: '#00ff88' }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </div>

                {/* FOOTER */}
                <div className="mt-16 text-center border-t border-slate-800 pt-8">
                    <p className="font-terminal text-nexus-primary text-xl mb-2">
                        Pazarlık başlasın. 🦀
                    </p>
                    <div className="flex justify-center gap-4 text-slate-600 text-sm">
                        <span>Blok Yüksekliği: #{8932102 + sim.tick}</span>
                        <span>|</span>
                        <span>Tick: {sim.tick}</span>
                        <span>|</span>
                        <span className="flex items-center gap-1">
                            Altyapı:
                            <span className="text-purple-400 font-bold">MONAD</span>
                        </span>
                    </div>
                </div>
            </main>
        </>
    );
}

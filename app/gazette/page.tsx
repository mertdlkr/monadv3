'use client';

import Navbar from '@/components/Navbar';
import { useSimContext } from '@/components/SimulationProvider';
import { EventType } from '@/lib/types';

const EVENT_TYPE_CONFIG: Record<EventType, { label: string; color: string; icon: string }> = {
    trade: { label: 'PİYASA', color: 'text-nexus-gold', icon: 'payments' },
    scam: { label: 'DOLANDIRICILIK', color: 'text-red-400', icon: 'warning' },
    cartel: { label: 'KARTEL', color: 'text-purple-400', icon: 'group' },
    bankruptcy: { label: 'İFLAS', color: 'text-red-600', icon: 'skull' },
    zabita: { label: 'ZABITA', color: 'text-blue-400', icon: 'security' },
    guild: { label: 'İTTİFAK', color: 'text-green-400', icon: 'handshake' },
    monopoly: { label: 'TEKEL', color: 'text-orange-400', icon: 'crown' },
    ilan: { label: 'İLAN', color: 'text-slate-400', icon: 'campaign' },
};

export default function GazettePage() {
    const sim = useSimContext();

    const topAgents = [...sim.agents]
        .filter(a => a.status === 'active')
        .sort((a, b) => b.wealth - a.wealth)
        .slice(0, 5);

    const bankruptAgents = sim.agents
        .filter(a => a.status === 'bankrupt')
        .slice(0, 5);

    const maxWealth = topAgents[0]?.wealth || 1;

    return (
        <>
            <Navbar />
            <main className="flex-grow w-full bg-nexus-bg">
                <div className="mx-auto max-w-[1200px] px-4 md:px-8 py-8">
                    {/* Masthead */}
                    <header className="flex flex-col gap-4 border-b-4 border-double border-nexus-primary/30 pb-6 mb-8">
                        <div className="flex flex-col md:flex-row justify-between items-center border-b border-nexus-border pb-2">
                            <div className="text-sm font-bold tracking-widest uppercase text-slate-500">İstanbul, Türkiye</div>
                            <div className="flex items-center gap-4 text-sm font-bold tracking-widest text-slate-500">
                                <span>Blok #{8932102 + sim.tick}</span>
                                <span className="w-1 h-1 bg-nexus-primary rounded-full" />
                                <span>Tick {sim.tick}</span>
                            </div>
                        </div>
                        <div className="flex flex-col items-center justify-center py-4 relative">
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1/4 h-[2px] bg-gradient-to-r from-transparent via-nexus-primary/30 to-transparent hidden md:block" />
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1/4 h-[2px] bg-gradient-to-r from-transparent via-nexus-primary/30 to-transparent hidden md:block" />
                            <h1 className="text-5xl md:text-7xl font-pixel text-nexus-primary tracking-tighter text-center leading-none neon-text">
                                NEXUS GAZETESİ
                            </h1>
                            <p className="font-grotesk italic text-lg text-nexus-gold font-semibold mt-3">
                                &quot;Hakikat, Ticaret ve Adalet&quot;
                            </p>
                        </div>
                        <nav className="flex flex-wrap justify-center gap-6 md:gap-12 py-3 border-t-2 border-b-2 border-nexus-border border-double">
                            {(['trade', 'bankruptcy', 'zabita', 'guild'] as EventType[]).map(type => {
                                const config = EVENT_TYPE_CONFIG[type];
                                return (
                                    <span key={type} className={`font-bold uppercase tracking-widest text-sm flex items-center gap-1 ${config.color}`}>
                                        <span className="material-symbols-outlined text-sm">{config.icon}</span>
                                        {config.label}
                                    </span>
                                );
                            })}
                        </nav>
                    </header>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                        {/* Main News Feed */}
                        <main className="lg:col-span-8 flex flex-col gap-6">
                            {/* Hero Article */}
                            {sim.events[0] && (
                                <article className="flex flex-col gap-4 border-b border-nexus-border pb-8">
                                    <div className="relative w-full bg-nexus-card rounded-lg overflow-hidden border border-nexus-border p-6">
                                        <span className={`${EVENT_TYPE_CONFIG[sim.events[0].type].color} font-bold text-xs tracking-widest uppercase`}>
                                            FLAŞ HABER
                                        </span>
                                        <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight mt-2">
                                            {sim.events[0].headline}
                                        </h2>
                                        <p className="text-slate-400 mt-3">{sim.events[0].description}</p>
                                        <div className="flex items-center gap-3 text-slate-500 text-sm mt-3">
                                            <span className="flex items-center gap-1">
                                                <span className="material-symbols-outlined text-sm">schedule</span>
                                                Tick {sim.events[0].timestamp}
                                            </span>
                                        </div>
                                    </div>
                                </article>
                            )}

                            {/* Secondary Articles Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {sim.events.slice(1, 9).map(event => {
                                    const config = EVENT_TYPE_CONFIG[event.type];
                                    return (
                                        <article
                                            key={event.id}
                                            className="flex flex-col gap-3 bg-nexus-card p-4 border border-nexus-border rounded-lg hover:border-nexus-primary/30 transition-colors"
                                        >
                                            <div className="flex justify-between items-start">
                                                <span className={`${config.color} font-bold text-xs tracking-widest uppercase flex items-center gap-1`}>
                                                    <span className="material-symbols-outlined text-sm">{config.icon}</span>
                                                    {config.label}
                                                </span>
                                                <span className="text-slate-500 text-xs">Tick {event.timestamp}</span>
                                            </div>
                                            <h3 className="text-lg font-bold text-white leading-tight">{event.headline}</h3>
                                            <p className="text-sm text-slate-400 line-clamp-2">{event.description}</p>
                                        </article>
                                    );
                                })}
                            </div>

                            {/* More events list */}
                            {sim.events.length > 9 && (
                                <div className="space-y-3 border-t border-nexus-border pt-6">
                                    <h3 className="font-terminal text-xl text-nexus-primary">SON HABERLER</h3>
                                    {sim.events.slice(9, 25).map(event => {
                                        const config = EVENT_TYPE_CONFIG[event.type];
                                        return (
                                            <div key={event.id} className="flex items-center gap-4 py-2 border-b border-nexus-border/50">
                                                <span className={`material-symbols-outlined ${config.color}`}>{config.icon}</span>
                                                <p className="text-sm text-slate-300 flex-1">{event.headline}</p>
                                                <span className="text-xs text-slate-500">T{event.timestamp}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </main>

                        {/* Sidebar */}
                        <aside className="lg:col-span-4 flex flex-col gap-6">
                            {/* Gini Widget */}
                            <div className="bg-nexus-card text-white p-6 border-2 border-nexus-primary rounded-lg relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-2 opacity-10">
                                    <span className="material-symbols-outlined text-8xl">speed</span>
                                </div>
                                <h3 className="font-pixel text-sm text-center border-b border-nexus-primary/30 pb-2 mb-4">GİNİ KATSAYISI</h3>
                                <div className="text-center">
                                    <span className={`text-5xl font-bold font-grotesk ${sim.currentGini > 0.6 ? 'text-nexus-alert' : sim.currentGini > 0.4 ? 'text-nexus-gold' : 'text-nexus-primary'
                                        }`}>
                                        {sim.currentGini.toFixed(2)}
                                    </span>
                                    <span className="text-xs uppercase tracking-widest text-nexus-primary font-bold mt-1 block">
                                        {sim.currentGini > 0.6 ? 'TEHLİKELİ BÖLGE' : sim.currentGini > 0.4 ? 'ORTA SEVİYE' : 'DÜŞÜK'}
                                    </span>
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-nexus-card border border-nexus-border p-4 text-center rounded-lg">
                                    <span className="text-xs font-bold uppercase text-slate-500">Toplam Ticaret</span>
                                    <span className="text-2xl font-bold text-white block">{sim.totalTrades}</span>
                                </div>
                                <div className="bg-nexus-card border border-nexus-border p-4 text-center rounded-lg">
                                    <span className="text-xs font-bold uppercase text-slate-500">İflas</span>
                                    <span className="text-2xl font-bold text-white block">{sim.totalBankruptcies}</span>
                                </div>
                            </div>

                            {/* Top 5 Leaderboard */}
                            <div className="border-2 border-nexus-primary rounded-lg bg-nexus-card p-4">
                                <h3 className="font-pixel text-sm text-center pb-2 mb-4 border-b border-nexus-primary/30 text-white">EN ZENGİN 5</h3>
                                <div className="flex flex-col gap-4">
                                    {topAgents.map((agent, idx) => (
                                        <div key={agent.id} className="flex flex-col gap-1">
                                            <div className="flex justify-between items-end text-sm font-bold text-white">
                                                <span>{idx + 1}. {agent.name}</span>
                                                <span className="text-nexus-gold">{agent.wealth.toLocaleString()} MON</span>
                                            </div>
                                            <div className="w-full h-2 bg-nexus-bg rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-nexus-primary rounded-full transition-all duration-500"
                                                    style={{ width: `${(agent.wealth / maxWealth) * 100}%` }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Recent Bankruptcies */}
                            {bankruptAgents.length > 0 && (
                                <div className="bg-nexus-card border border-nexus-border text-white p-6 rounded-lg flex flex-col gap-4">
                                    <div className="flex items-center gap-2 border-b border-nexus-border pb-2">
                                        <span className="material-symbols-outlined">skull</span>
                                        <h3 className="font-bold text-lg">SON İFLASLAR</h3>
                                    </div>
                                    <ul className="flex flex-col gap-3">
                                        {bankruptAgents.map(agent => (
                                            <li key={agent.id} className="flex items-center justify-between">
                                                <span className="text-sm text-red-300">{agent.name}</span>
                                                <span className="text-xs text-slate-500">☠️</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </aside>
                    </div>
                </div>
            </main>
        </>
    );
}

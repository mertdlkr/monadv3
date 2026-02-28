'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import { useSimContext } from '@/components/SimulationProvider';
import { ROLE_LABELS, SHOP_LABELS } from '@/lib/agents';
import { Agent } from '@/lib/types';
import Image from 'next/image';

function AgentModal({ agent, onClose }: { agent: Agent; onClose: () => void }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={onClose}>
            <div
                className="bg-nexus-card border-2 border-nexus-primary rounded-xl p-6 max-w-lg w-full mx-4 max-h-[80vh] overflow-y-auto"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 relative rounded-lg overflow-hidden border-2 border-nexus-primary/30">
                            <Image src={agent.avatar} alt={agent.name} fill className="object-cover" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white">{agent.name}</h2>
                            <p className="text-nexus-primary font-terminal text-lg">{SHOP_LABELS[agent.shopType]}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-white">
                        <span className="material-symbols-outlined text-2xl">close</span>
                    </button>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-nexus-bg p-3 rounded-lg">
                        <p className="text-xs text-slate-400 uppercase">Servet</p>
                        <p className="text-xl font-bold text-nexus-gold">{agent.wealth.toLocaleString()} MON</p>
                    </div>
                    <div className="bg-nexus-bg p-3 rounded-lg">
                        <p className="text-xs text-slate-400 uppercase">Rol</p>
                        <p className="text-xl font-bold text-white">{ROLE_LABELS[agent.role]}</p>
                    </div>
                    <div className="bg-nexus-bg p-3 rounded-lg">
                        <p className="text-xs text-slate-400 uppercase">İtibar</p>
                        <div className="flex items-center gap-1 mt-1">
                            {[1, 2, 3, 4, 5].map(s => (
                                <span
                                    key={s}
                                    className={`material-symbols-outlined text-sm ${s <= Math.round(agent.reputation) ? 'text-nexus-gold' : 'text-white/20'
                                        }`}
                                >
                                    star
                                </span>
                            ))}
                            <span className="text-white font-bold ml-1">{agent.reputation.toFixed(1)}</span>
                        </div>
                    </div>
                    <div className="bg-nexus-bg p-3 rounded-lg">
                        <p className="text-xs text-slate-400 uppercase">Ticaret</p>
                        <p className="text-xl font-bold text-white">{agent.trades}</p>
                    </div>
                </div>

                {/* Wealth History Mini Chart */}
                <div className="bg-nexus-bg p-3 rounded-lg mb-4">
                    <p className="text-xs text-slate-400 uppercase mb-2">Servet Geçmişi</p>
                    <div className="h-16 flex items-end gap-[2px]">
                        {agent.wealthHistory.slice(-30).map((w, i) => {
                            const max = Math.max(...agent.wealthHistory.slice(-30), 1);
                            const height = (w / max) * 100;
                            return (
                                <div
                                    key={i}
                                    className="flex-1 rounded-t bg-nexus-primary/60 transition-all"
                                    style={{ height: `${Math.max(2, height)}%` }}
                                />
                            );
                        })}
                    </div>
                </div>

                {/* Allies */}
                {agent.allies.length > 0 && (
                    <div className="bg-nexus-bg p-3 rounded-lg">
                        <p className="text-xs text-slate-400 uppercase mb-2">Müttefikler</p>
                        <div className="flex flex-wrap gap-2">
                            {agent.allies.slice(0, 5).map(id => (
                                <span key={id} className="bg-nexus-primary/20 text-nexus-primary text-xs px-2 py-1 rounded">
                                    Agent #{id}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Status */}
                <div className="mt-4 flex items-center gap-2">
                    {agent.status === 'active' && (
                        <span className="flex items-center gap-2 text-xs text-green-400 bg-green-900/20 px-3 py-1.5 rounded">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                            Dükkan Açık
                        </span>
                    )}
                    {agent.status === 'bankrupt' && (
                        <span className="flex items-center gap-2 text-xs text-red-400 bg-red-900/20 px-3 py-1.5 rounded">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                            İflas
                        </span>
                    )}
                    {agent.status === 'investigation' && (
                        <span className="flex items-center gap-2 text-xs text-yellow-500 bg-yellow-900/20 px-3 py-1.5 rounded">
                            <span className="material-symbols-outlined text-sm">gavel</span>
                            Soruşturmada
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}

type FilterType = 'all' | 'richest' | 'bankrupt' | 'investigation' | 'aga';

export default function MarketPage() {
    const sim = useSimContext();
    const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
    const [filter, setFilter] = useState<FilterType>('all');

    const filteredAgents = sim.agents.filter(a => {
        if (filter === 'all') return true;
        if (filter === 'richest') return a.wealth > 2000;
        if (filter === 'bankrupt') return a.status === 'bankrupt';
        if (filter === 'investigation') return a.status === 'investigation';
        if (filter === 'aga') return a.role === 'aga';
        return true;
    }).sort((a, b) => {
        if (filter === 'richest') return b.wealth - a.wealth;
        return 0;
    });

    const filters: { key: FilterType; label: string; icon?: string }[] = [
        { key: 'all', label: 'Tümü' },
        { key: 'richest', label: 'En Zengin', icon: 'attach_money' },
        { key: 'bankrupt', label: 'İflas', icon: 'trending_down' },
        { key: 'investigation', label: 'Zabıta Baskını', icon: 'local_police' },
        { key: 'aga', label: 'Nexus Ağası', icon: 'diamond' },
    ];

    return (
        <>
            <Navbar />
            <main className="flex-1 px-4 md:px-12 py-8 max-w-[1600px] mx-auto w-full">
                {/* Hero Title */}
                <div className="mb-10 space-y-4">
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
                        50 Dükkan, <span className="text-nexus-primary">Sınırsız Drama</span>
                    </h2>
                    <p className="text-lg text-slate-400 max-w-2xl">
                        Büyük Nexus&apos;un nabzını tutun. Kim zengin oldu, kim iflas etti, kime zabıta baskını yapıldı?
                    </p>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-3 mb-8 pb-4 border-b border-nexus-primary/10">
                    {filters.map(f => (
                        <button
                            key={f.key}
                            onClick={() => setFilter(f.key)}
                            className={`px-5 py-2 rounded-lg font-bold text-sm transition-all flex items-center gap-2 ${filter === f.key
                                ? 'bg-nexus-primary text-nexus-bg shadow-lg shadow-nexus-primary/20'
                                : 'bg-nexus-card border border-transparent hover:border-nexus-primary/30 text-slate-300'
                                }`}
                        >
                            {f.icon && <span className="material-symbols-outlined text-base">{f.icon}</span>}
                            {f.label}
                        </button>
                    ))}
                </div>

                {/* Agent Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredAgents.map(agent => (
                        <div
                            key={agent.id}
                            onClick={() => setSelectedAgent(agent)}
                            className={`group relative rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1 ${agent.status === 'bankrupt'
                                ? 'bg-nexus-card border border-red-900/50 opacity-75 hover:opacity-100'
                                : agent.role === 'aga'
                                    ? 'bg-nexus-card border-2 border-nexus-gold shadow-[0_0_20px_rgba(255,215,0,0.15)]'
                                    : agent.status === 'investigation'
                                        ? 'bg-nexus-card border border-yellow-600/50'
                                        : 'bg-nexus-card border border-white/5 hover:border-nexus-primary/50'
                                }`}
                        >
                            {/* Aga Badge */}
                            {agent.role === 'aga' && (
                                <div className="absolute top-0 right-0 bg-nexus-gold text-nexus-bg text-xs font-bold px-3 py-1 rounded-bl-lg z-10">
                                    👑 NEXUS AĞASI
                                </div>
                            )}

                            {/* Bankrupt overlay */}
                            {agent.status === 'bankrupt' && (
                                <div className="absolute inset-0 bg-red-900/20 pointer-events-none z-10 flex items-center justify-center">
                                    <div className="border-4 border-red-600 text-red-600 font-black text-2xl -rotate-12 px-4 py-2 uppercase tracking-widest opacity-80">
                                        İFLAS
                                    </div>
                                </div>
                            )}

                            {/* Investigation tape */}
                            {agent.status === 'investigation' && (
                                <div className="absolute top-8 -left-10 w-[150%] h-6 police-tape z-20 rotate-[-15deg] shadow-lg" />
                            )}

                            {/* Avatar */}
                            <div className="aspect-[4/3] w-full relative bg-nexus-bg">
                                <Image
                                    src={agent.avatar}
                                    alt={agent.name}
                                    fill
                                    className={`object-contain p-4 transition-all duration-500 ${agent.status === 'bankrupt' ? 'grayscale' : 'grayscale group-hover:grayscale-0'
                                        }`}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-nexus-card via-transparent to-transparent opacity-80" />
                            </div>

                            {/* Info */}
                            <div className="p-5 relative -mt-12">
                                <div className="flex justify-between items-end mb-2">
                                    <h3 className={`text-lg font-bold transition-colors ${agent.status === 'bankrupt' ? 'text-red-200 line-through decoration-red-500' : 'text-white group-hover:text-nexus-primary'
                                        }`}>
                                        {agent.name} — {SHOP_LABELS[agent.shopType]}
                                    </h3>
                                    <div className={`px-2 py-0.5 rounded text-xs font-medium uppercase tracking-wider border ${agent.role === 'aga' ? 'bg-nexus-gold/20 text-nexus-gold border-nexus-gold/30' :
                                        agent.status === 'bankrupt' ? 'bg-red-900/30 text-red-400 border-red-900/50' :
                                            agent.role === 'kalpazan' ? 'bg-purple-900/30 text-purple-400 border-purple-900/50' :
                                                'bg-white/10 text-slate-400 border-white/5'
                                        }`}>
                                        {ROLE_LABELS[agent.role]}
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-slate-400">Servet</span>
                                        <span className={`font-mono font-bold ${agent.status === 'bankrupt' ? 'text-red-500' :
                                            agent.role === 'aga' ? 'text-nexus-gold text-lg' : 'text-white'
                                            }`}>
                                            {agent.wealth.toLocaleString()} MON
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between text-sm border-t border-white/5 pt-2">
                                        <span className="text-slate-400">İtibar</span>
                                        <div className="flex items-center">
                                            {[1, 2, 3, 4, 5].map(s => (
                                                <span
                                                    key={s}
                                                    className={`material-symbols-outlined text-[16px] ${s <= Math.round(agent.reputation)
                                                        ? agent.status === 'bankrupt' ? 'text-red-500/50' : 'text-nexus-gold/80'
                                                        : 'text-white/20'
                                                        }`}
                                                >
                                                    star
                                                </span>
                                            ))}
                                            <span className="ml-1 text-white font-medium">{agent.reputation.toFixed(1)}</span>
                                        </div>
                                    </div>

                                    {/* Status Badge */}
                                    <div className="flex items-center gap-2 text-xs">
                                        {agent.status === 'active' && (
                                            <span className="flex items-center gap-2 text-green-400 bg-green-900/20 px-2 py-1.5 rounded">
                                                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                                                Dükkan Açık
                                            </span>
                                        )}
                                        {agent.status === 'bankrupt' && (
                                            <span className="flex items-center gap-2 text-red-400 bg-red-900/20 px-2 py-1.5 rounded">
                                                <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                                                Kapalı
                                            </span>
                                        )}
                                        {agent.status === 'investigation' && (
                                            <span className="flex items-center gap-2 text-yellow-500 bg-yellow-900/20 px-2 py-1.5 rounded">
                                                <span className="material-symbols-outlined text-sm">gavel</span>
                                                Soruşturmada
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>

            {/* Agent Modal */}
            {selectedAgent && (
                <AgentModal
                    agent={selectedAgent}
                    onClose={() => setSelectedAgent(null)}
                />
            )}
        </>
    );
}

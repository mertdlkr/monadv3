'use client';
// ============================================================
// NEXUS — Simulation Engine Hook
// ============================================================
import { useState, useEffect, useCallback, useRef } from 'react';
import { Agent, NewsEvent, JobListing, SimulationState, EventType } from './types';
import { createAgents, SHOP_LABELS, ROLE_LABELS } from './agents';

// ---- Gini Coefficient Calculator ----
function calculateGini(values: number[]): number {
    const n = values.length;
    if (n === 0) return 0;
    const sorted = [...values].sort((a, b) => a - b);
    let sum = 0;
    let cumulativeSum = 0;
    for (let i = 0; i < n; i++) {
        cumulativeSum += sorted[i];
        sum += cumulativeSum;
    }
    const totalWealth = cumulativeSum;
    if (totalWealth === 0) return 0;
    return 1 - (2 * sum) / (n * totalWealth) + 1 / n;
}

// ---- Turkish Headline Generators ----
const HEADLINES: Record<EventType, (agents: Agent[], amount?: number) => { headline: string; description: string }> = {
    trade: (agents, amount) => ({
        headline: `💰 ${agents[0]?.name} ile ${agents[1]?.name} arasında ${amount} MON'luk ticaret!`,
        description: `${agents[0]?.name}'in ${SHOP_LABELS[agents[0]?.shopType]}sından ${agents[1]?.name}'in ${SHOP_LABELS[agents[1]?.shopType]}sına büyük alışveriş.`,
    }),
    scam: (agents, amount) => ({
        headline: `🚨 ${agents[0]?.name} dolandırıcılıkla suçlanıyor! ${amount} MON kayıp`,
        description: `Çarşı esnafı şokta: ${agents[0]?.name} sahte mal satmakla suçlanıyor. Mağdur: ${agents[1]?.name}.`,
    }),
    cartel: (agents) => ({
        headline: `🤝 Gizli Kartel! ${agents[0]?.name} ve ${agents[1]?.name} fiyatları sabitledi`,
        description: `İki büyük tüccar piyasayı manipüle etmekle suçlanıyor. Zabıta soruşturma başlattı.`,
    }),
    bankruptcy: (agents) => ({
        headline: `💀 ${agents[0]?.name} İFLAS ETTİ!`,
        description: `${agents[0]?.name}'in ${SHOP_LABELS[agents[0]?.shopType]}sı kapandı. Borçları ödenemez hale geldi. Çarşıda şok dalga!`,
    }),
    zabita: (agents, amount) => ({
        headline: `👮 Zabıta baskını! ${agents[0]?.name}'e ${amount} MON ceza`,
        description: `${agents[0]?.name}'in dükkanına denetim yapıldı. Kayıt dışı stok tespit edildi.`,
    }),
    guild: (agents) => ({
        headline: `⚔️ Yeni Lonca kuruldu: ${agents[0]?.name} lider seçildi`,
        description: `${agents.slice(0, 3).map(a => a.name).join(', ')} güçlerini birleştirdi. Piyasada güç dengesi değişiyor.`,
    }),
    monopoly: (agents) => ({
        headline: `👑 ${agents[0]?.name} TEKEL İLAN ETTİ!`,
        description: `${SHOP_LABELS[agents[0]?.shopType]} sektöründe ${agents[0]?.name} rakipsiz kaldı. Fiyatlar kontrol altında.`,
    }),
    ilan: (agents, amount) => ({
        headline: `📋 ${agents[0]?.name} ${amount} MON'a iş ilanı açtı`,
        description: `${agents[0]?.name} dükkanı için yeni eleman arıyor. Başvurular açık.`,
    }),
};

// Event probability weights
const EVENT_WEIGHTS: { type: EventType; weight: number }[] = [
    { type: 'trade', weight: 40 },
    { type: 'scam', weight: 10 },
    { type: 'cartel', weight: 10 },
    { type: 'bankruptcy', weight: 10 },
    { type: 'zabita', weight: 10 },
    { type: 'guild', weight: 10 },
    { type: 'monopoly', weight: 5 },
    { type: 'ilan', weight: 5 },
];

function pickEventType(): EventType {
    const totalWeight = EVENT_WEIGHTS.reduce((s, e) => s + e.weight, 0);
    let rand = Math.random() * totalWeight;
    for (const e of EVENT_WEIGHTS) {
        rand -= e.weight;
        if (rand <= 0) return e.type;
    }
    return 'trade';
}

function pickRandom<T>(arr: T[], count: number = 1): T[] {
    const shuffled = [...arr].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
}

// JOB CATEGORIES
const JOB_CATEGORIES = ['Tasarım', 'Yazılım', 'Çeviri', 'Veri Analizi', 'Pazarlama', 'Lojistik'];
const JOB_TITLES = [
    'Dükkan Tabelası Tasarımı', 'Stok Takip Sistemi', 'Ticaret Kontratı Çevirisi',
    'Piyasa Analizi Raporu', 'Sosyal Medya Yönetimi', 'Mal Taşıma İşi',
    'Logo Tasarımı', 'Web Sitesi Geliştirme', 'Müşteri Memnuniyeti Analizi',
    'Reklam Kampanyası', 'Envanter Optimizasyonu', 'Tedarik Zinciri Planlaması',
];

// ---- Main Hook ----
export function useSimulation(intervalMs: number = 3000): SimulationState {
    const [state, setState] = useState<SimulationState>(() => {
        const agents = createAgents();
        const wealths = agents.map(a => a.wealth);
        const gini = calculateGini(wealths);

        // Pre-seed 5 starter jobs so İlan page has content immediately
        const starterJobs: JobListing[] = [
            { id: 'seed-1', title: 'Dükkan Tabelası Tasarımı', description: `${agents[0].name} tarafından ilan edildi.`, budget: 120, employerId: agents[0].id, category: 'Tasarım', status: 'open', applicants: 2, createdAt: 0 },
            { id: 'seed-2', title: 'Stok Takip Sistemi', description: `${agents[3].name} tarafından ilan edildi.`, budget: 250, employerId: agents[3].id, category: 'Yazılım', status: 'open', applicants: 0, createdAt: 0 },
            { id: 'seed-3', title: 'Ticaret Kontratı Çevirisi', description: `${agents[7].name} tarafından ilan edildi.`, budget: 80, employerId: agents[7].id, category: 'Çeviri', status: 'in-progress', applicants: 3, createdAt: 0 },
            { id: 'seed-4', title: 'Piyasa Analizi Raporu', description: `${agents[12].name} tarafından ilan edildi.`, budget: 180, employerId: agents[12].id, category: 'Veri Analizi', status: 'open', applicants: 1, createdAt: 0 },
            { id: 'seed-5', title: 'Sosyal Medya Yönetimi', description: `${agents[20].name} tarafından ilan edildi.`, budget: 150, employerId: agents[20].id, category: 'Pazarlama', status: 'open', applicants: 0, createdAt: 0 },
        ];

        return {
            tick: 0,
            agents,
            events: [],
            jobs: starterJobs,
            giniHistory: [gini],
            currentGini: gini,
            totalTrades: 0,
            totalBankruptcies: 0,
        };
    });

    const tickRef = useRef(0);

    const simulateTick = useCallback(() => {
        setState(prev => {
            const tick = prev.tick + 1;
            tickRef.current = tick;
            const agents = prev.agents.map(a => ({ ...a, wealthHistory: [...a.wealthHistory] }));
            const newEvents: NewsEvent[] = [];
            const newJobs: JobListing[] = [...prev.jobs];

            // Generate 2-4 events per tick
            const eventCount = 2 + Math.floor(Math.random() * 3);

            for (let e = 0; e < eventCount; e++) {
                const eventType = pickEventType();
                const activeAgents = agents.filter(a => a.status === 'active');
                if (activeAgents.length < 2) continue;

                const involved = pickRandom(activeAgents, eventType === 'guild' ? 3 : 2);
                let amount = Math.floor(50 + Math.random() * 300);

                switch (eventType) {
                    case 'trade': {
                        const seller = involved[0];
                        const buyer = involved[1];
                        if (buyer.wealth >= amount) {
                            const sellerIdx = agents.findIndex(a => a.id === seller.id);
                            const buyerIdx = agents.findIndex(a => a.id === buyer.id);
                            agents[sellerIdx].wealth += amount;
                            agents[buyerIdx].wealth -= amount;
                            agents[sellerIdx].trades++;
                            agents[buyerIdx].trades++;
                        }
                        break;
                    }
                    case 'scam': {
                        const scammer = involved[0];
                        const victim = involved[1];
                        const scammerIdx = agents.findIndex(a => a.id === scammer.id);
                        const victimIdx = agents.findIndex(a => a.id === victim.id);
                        amount = Math.min(amount, victim.wealth);
                        agents[scammerIdx].wealth += amount;
                        agents[victimIdx].wealth -= amount;
                        agents[scammerIdx].reputation = Math.max(0, agents[scammerIdx].reputation - 0.5);
                        break;
                    }
                    case 'cartel': {
                        involved.forEach(a => {
                            const idx = agents.findIndex(ag => ag.id === a.id);
                            agents[idx].wealth += Math.floor(amount * 0.3);
                            if (!agents[idx].allies.includes(involved[0].id === a.id ? involved[1].id : involved[0].id)) {
                                agents[idx].allies.push(involved[0].id === a.id ? involved[1].id : involved[0].id);
                            }
                        });
                        break;
                    }
                    case 'bankruptcy': {
                        const poorest = activeAgents.reduce((min, a) => a.wealth < min.wealth ? a : min);
                        if (poorest.wealth < 100) {
                            const idx = agents.findIndex(a => a.id === poorest.id);
                            agents[idx].status = 'bankrupt';
                            agents[idx].wealth = 0;
                            // remove from involved, put poorest
                            involved[0] = agents[idx];
                        }
                        break;
                    }
                    case 'zabita': {
                        const target = involved[0];
                        const idx = agents.findIndex(a => a.id === target.id);
                        const fine = Math.min(amount, agents[idx].wealth);
                        agents[idx].wealth -= fine;
                        agents[idx].reputation = Math.max(0, agents[idx].reputation - 0.3);
                        amount = fine;
                        if (target.role === 'kalpazan') {
                            agents[idx].status = 'investigation';
                        }
                        break;
                    }
                    case 'guild': {
                        involved.forEach(a => {
                            const idx = agents.findIndex(ag => ag.id === a.id);
                            agents[idx].reputation = Math.min(5, agents[idx].reputation + 0.2);
                        });
                        break;
                    }
                    case 'monopoly': {
                        const monopolist = activeAgents.reduce((max, a) => a.wealth > max.wealth ? a : max);
                        const idx = agents.findIndex(a => a.id === monopolist.id);
                        agents[idx].wealth += Math.floor(agents[idx].wealth * 0.1);
                        involved[0] = agents[idx];
                        break;
                    }
                    case 'ilan': {
                        amount = Math.floor(30 + Math.random() * 200);
                        const employer = involved[0];
                        const newJob: JobListing = {
                            id: `job-${tick}-${e}`,
                            title: JOB_TITLES[Math.floor(Math.random() * JOB_TITLES.length)],
                            description: `${employer.name} tarafından ilan edildi.`,
                            budget: amount,
                            employerId: employer.id,
                            category: JOB_CATEGORIES[Math.floor(Math.random() * JOB_CATEGORIES.length)],
                            status: 'open',
                            applicants: Math.floor(Math.random() * 5),
                            createdAt: tick,
                        };
                        newJobs.unshift(newJob);
                        break;
                    }
                }

                const { headline, description } = HEADLINES[eventType](involved, amount);
                newEvents.push({
                    id: `ev-${tick}-${e}`,
                    type: eventType,
                    headline,
                    description,
                    agentIds: involved.map(a => a.id),
                    timestamp: tick,
                    amount,
                });
            }

            // Power law: top 20% gain extra 5%
            const sorted = [...agents].filter(a => a.status === 'active').sort((a, b) => b.wealth - a.wealth);
            const top20 = sorted.slice(0, Math.ceil(sorted.length * 0.2));
            top20.forEach(a => {
                const idx = agents.findIndex(ag => ag.id === a.id);
                agents[idx].wealth += Math.floor(agents[idx].wealth * 0.05);
            });

            // Update wealth history
            agents.forEach(a => {
                a.wealthHistory.push(a.wealth);
                if (a.wealthHistory.length > 50) a.wealthHistory.shift();
            });

            // Recalculate Gini
            const wealths = agents.map(a => a.wealth);
            const newGini = calculateGini(wealths);
            const giniHistory = [...prev.giniHistory, newGini];
            if (giniHistory.length > 100) giniHistory.shift();

            return {
                tick,
                agents,
                events: [...newEvents, ...prev.events].slice(0, 100),
                jobs: newJobs.slice(0, 50),
                giniHistory,
                currentGini: newGini,
                totalTrades: prev.totalTrades + newEvents.filter(e => e.type === 'trade').length,
                totalBankruptcies: agents.filter(a => a.status === 'bankrupt').length,
            };
        });
    }, []);

    useEffect(() => {
        const interval = setInterval(simulateTick, intervalMs);
        return () => clearInterval(interval);
    }, [simulateTick, intervalMs]);

    return state;
}

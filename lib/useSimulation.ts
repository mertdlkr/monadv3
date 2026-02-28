'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Agent, NewsEvent, JobListing, SimulationState, EventType } from './types';
import { createAgents } from './agents';

export function calculateGini(wealths: number[]): number {
    if (wealths.length === 0) return 0;
    const sorted = [...wealths].filter(w => w > 0).sort((a, b) => a - b);
    const n = sorted.length;
    if (n === 0) return 0;
    const mean = sorted.reduce((a, b) => a + b, 0) / n;
    if (mean === 0) return 0;

    let sumDiff = 0;
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            sumDiff += Math.abs(sorted[i] - sorted[j]);
        }
    }
    return Math.min(sumDiff / (2 * n * n * mean), 1); // 0 ile 1 arası clamp
}

function weightedRandom(weights: Record<string, number>): any {
    const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);
    let rand = Math.random() * totalWeight;
    for (const [key, weight] of Object.entries(weights)) {
        rand -= weight;
        if (rand <= 0) return key;
    }
    return Object.keys(weights)[0];
}

function generateRandomEvent(state: SimulationState): NewsEvent | null {
    const weights = {
        trade: 35,
        scam: 12,
        cartel: 8,
        zabita: 10,
        guild: 8,
        monopoly: 7,
        fight: 10,
        ilan: 10,
    };

    const type = weightedRandom(weights) as EventType;
    const active = state.agents.filter(a => !a.isBankrupt);
    if (active.length < 2) return null;

    const agent1 = active[Math.floor(Math.random() * active.length)];
    const agent2 = active.filter(a => a.id !== agent1.id)[Math.floor(Math.random() * (active.length - 1))];

    if (!agent1 || !agent2) return null;

    const tradeItems = [
        "İpek Halı", "Safran", "Altın Bilezik", "Gümüş Yüzük", "Deri Çanta",
        "Baharat Seti", "Osmanlı Çinisi", "El Yapımı Lamba", "Türk Kahvesi Seti",
        "NFT Koleksiyon", "Antik Harita", "İpek Şal", "Bakır Cezve", "Kilim",
        "Parfüm", "Lokum Kutusu", "Seramik Vazo", "El Yazması", "Tespih",
        "Nazar Boncuğu", "Çini Tabak", "Mozaik Kutu", "Pirinç Mumluk"
    ];
    const item = tradeItems[Math.floor(Math.random() * tradeItems.length)];
    const basePrice = Math.floor(Math.random() * 400) + 50;

    switch (type) {
        case 'trade': {
            const finalPrice = basePrice + Math.floor(Math.random() * 200) - 100;
            const isOverpriced = finalPrice > basePrice * 1.5;
            return {
                id: `trade-${state.tick}-${Math.random()}`,
                type: 'trade',
                category: 'PİYASA',
                headline: isOverpriced
                    ? `💰 ${agent1.name} ${agent2.name}'e ${item} kazıkladı: ${finalPrice} MON!`
                    : `🔄 ${agent1.name} → ${agent2.name}: ${item}, ${finalPrice} MON`,
                description: isOverpriced
                    ? `Piyasa değeri ${basePrice} MON olan ürün ${finalPrice} MON'a satıldı. ${agent2.name} kazıklandı!`
                    : `Adil bir ticaret gerçekleşti.`,
                agentIds: [agent1.id, agent2.id],
                tick: state.tick,
                timestamp: new Date().toISOString(),
            };
        }
        case 'scam': {
            const scammer = active.find(a => a.role === 'trickster') || agent1;
            const victim = active.find(a => a.role === 'tourist') || agent2;
            const scamPrice = basePrice * 3;
            return {
                id: `scam-${state.tick}-${Math.random()}`,
                type: 'scam',
                category: 'FLAŞ',
                headline: `🚨 DOLANDIRICILIK: ${scammer.name}, ${victim.name}'a sahte ${item} sattı!`,
                description: `Değeri ${basePrice} MON olan ürün ${scamPrice} MON'a kakalandı. ${victim.name} farkında değil!`,
                agentIds: [scammer.id, victim.id],
                tick: state.tick,
                timestamp: new Date().toISOString(),
            };
        }
        case 'cartel': {
            const agent3 = active.filter(a => a.id !== agent1.id && a.id !== agent2.id)[0];
            if (!agent3) return null;
            const cartelNames = ["Baharat Karteli", "Altın Loncası", "Gölge İttifakı", "Halı Mafyası", "Lüks Sendikası"];
            const cartelName = cartelNames[Math.floor(Math.random() * cartelNames.length)];
            return {
                id: `cartel-${state.tick}-${Math.random()}`,
                type: 'cartel',
                category: 'KARTEL',
                headline: `🤝 GİZLİ ANLAŞMA: ${agent1.name}, ${agent2.name} ve ${agent3.name} "${cartelName}" kurdu!`,
                description: `Fiyatları %${Math.floor(Math.random() * 200) + 100} artırmayı planlıyorlar.`,
                agentIds: [agent1.id, agent2.id, agent3.id],
                tick: state.tick,
                timestamp: new Date().toISOString(),
            };
        }
        case 'zabita': {
            const cop = active.find(a => a.role === 'officer') || agent1;
            const suspect = active.find(a => a.role === 'trickster') || agent2;
            const bribe = Math.random() > 0.5;
            return {
                id: `zabita-${state.tick}-${Math.random()}`,
                type: 'zabita',
                category: 'ZABITA',
                headline: bribe
                    ? `👮 Zabıta ${cop.name}, ${suspect.name}'dan RÜŞVET ALDI! Dosya kapandı.`
                    : `👮 OPERASYON: Zabıta ${cop.name}, ${suspect.name}'ın dükkanını mühürledi!`,
                description: bribe
                    ? `${Math.floor(Math.random() * 300) + 100} MON rüşvet ödendi. Adalet yerini bulamadı.`
                    : `Sahte ürün satışı tespit edildi. Ceza: ${Math.floor(Math.random() * 500) + 200} MON.`,
                agentIds: [cop.id, suspect.id],
                tick: state.tick,
                timestamp: new Date().toISOString(),
            };
        }
        case 'guild': {
            const decisions = [
                { headline: `⚖️ ESNAF ODASI: Vergi oranı %${Math.floor(Math.random() * 15) + 5}'e çıkarıldı!`, desc: "Küçük esnaf isyan ediyor." },
                { headline: `⚖️ LONCA KARARI: Yeni dükkan açma maliyeti 2x arttırıldı!`, desc: "Tekeller güçleniyor." },
                { headline: `⚖️ ESNAF ODASI: Sahte ürün cezaları 3x arttırıldı!`, desc: "Kalpazanlar endişeli." },
                { headline: `⚖️ LONCA: Kartel soruşturması başlatıldı!`, desc: "3 tezgahtar sorguya çağrıldı." },
                { headline: `⚖️ ESNAF ODASI: Turist koruma yasası çıktı!`, desc: "Kazıklama cezası 500 MON." },
            ];
            const decision = decisions[Math.floor(Math.random() * decisions.length)];
            return {
                id: `guild-${state.tick}-${Math.random()}`,
                type: 'guild',
                category: 'İTTİFAK',
                headline: decision.headline,
                description: decision.desc,
                agentIds: [],
                tick: state.tick,
                timestamp: new Date().toISOString(),
            };
        }
        case 'monopoly': {
            const richest = active.reduce((max, a) => a.wealth > max.wealth ? a : max);
            const shopCount = Math.floor(Math.random() * 5) + 3;
            return {
                id: `monopoly-${state.tick}-${Math.random()}`,
                type: 'monopoly',
                category: 'TEKEL',
                headline: `👑 TEKEL ALARMI: ${richest.name} ${shopCount}. dükkanını satın aldı!`,
                description: `Toplam serveti: ${Math.round(richest.wealth)} MON. Çarşının %${Math.floor(Math.random() * 30) + 10}'unu kontrol ediyor.`,
                agentIds: [richest.id],
                tick: state.tick,
                timestamp: new Date().toISOString(),
            };
        }
        case 'fight': {
            const fightReasons = [
                `${agent1.name} müşteri çalıyor diye ${agent2.name}'a bağırdı!`,
                `${agent1.name} ve ${agent2.name} arasında fiyat savaşı başladı!`,
                `${agent1.name}, ${agent2.name}'ın dükkanının önünü kapatıyor!`,
                `${agent1.name} ve ${agent2.name} aynı müşteriye satış yapmaya çalıştı — kaos!`,
            ];
            return {
                id: `fight-${state.tick}-${Math.random()}`,
                type: 'fight',
                category: 'FLAŞ',
                headline: `🔥 KAVGA: ${fightReasons[Math.floor(Math.random() * fightReasons.length)]}`,
                description: `Çarşıda tansiyon yükseliyor.`,
                agentIds: [agent1.id, agent2.id],
                tick: state.tick,
                timestamp: new Date().toISOString(),
            };
        }
        case 'ilan': {
            const jobs = [
                { title: "Logo Tasarımı", budget: 50 },
                { title: "Akıllı Kontrat Audit", budget: 200 },
                { title: "Piyasa Araştırması", budget: 100 },
                { title: "Sosyal Medya Yönetimi", budget: 75 },
                { title: "Web Sitesi Geliştirme", budget: 300 },
                { title: "NFT Koleksiyon Tasarımı", budget: 150 },
                { title: "Çeviri Hizmeti", budget: 40 },
                { title: "Veri Analizi", budget: 120 },
            ];
            const job = jobs[Math.floor(Math.random() * jobs.length)];
            return {
                id: `ilan-${state.tick}-${Math.random()}`,
                type: 'ilan',
                category: 'PİYASA',
                headline: `📋 YENİ İLAN: "${job.title}" — ${job.budget} USDC`,
                description: `${agent1.name} talip oldu, pazarlık yapıyor...`,
                agentIds: [agent1.id],
                tick: state.tick,
                timestamp: new Date().toISOString(),
            };
        }
    }
    return null;
}

function applyEventEffects(newState: SimulationState, event: NewsEvent) {
    switch (event.type) {
        case 'trade': {
            const [sellerId, buyerId] = event.agentIds;
            const price = Math.floor(Math.random() * 300) + 50;
            const seller = newState.agents.find(a => a.id === sellerId);
            const buyer = newState.agents.find(a => a.id === buyerId);
            if (seller) seller.wealth += price;
            if (buyer) buyer.wealth -= price * 0.8;
            break;
        }
        case 'scam': {
            const [scammerId, victimId] = event.agentIds;
            const scamAmount = Math.floor(Math.random() * 400) + 100;
            const scammer = newState.agents.find(a => a.id === scammerId);
            const victim = newState.agents.find(a => a.id === victimId);
            if (scammer) scammer.wealth += scamAmount;
            if (victim) victim.wealth -= scamAmount;
            break;
        }
        case 'zabita': {
            const [copId, suspectId] = event.agentIds;
            const fine = Math.floor(Math.random() * 300) + 100;
            const cop = newState.agents.find(a => a.id === copId);
            const suspect = newState.agents.find(a => a.id === suspectId);
            if (event.headline.includes('RÜŞVET')) {
                if (cop) cop.wealth += fine * 0.5;
                if (suspect) suspect.wealth -= fine * 0.5;
            } else {
                if (suspect) suspect.wealth -= fine;
            }
            break;
        }
        case 'monopoly': {
            const [richId] = event.agentIds;
            const rich = newState.agents.find(a => a.id === richId);
            if (rich) rich.wealth += Math.floor(Math.random() * 200) + 100;
            break;
        }
    }
}

function simulationTick(state: SimulationState): SimulationState {
    const newState = { ...state, tick: state.tick + 1 };

    newState.agents = newState.agents.map(agent => {
        if (agent.isBankrupt) return { ...agent, currentAction: "bankrupt" };

        if (Math.random() < 0.3) {
            return {
                ...agent,
                targetX: Math.random() * 90 + 5,
                targetY: Math.random() * 85 + 10,
                isMoving: true,
                currentAction: "walking"
            };
        }

        const dx = (agent.targetX - agent.posX) * 0.15;
        const dy = (agent.targetY - agent.posY) * 0.15;

        return {
            ...agent,
            posX: agent.posX + dx,
            posY: agent.posY + dy,
            isMoving: Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5,
        };
    });

    const eventCount = Math.floor(Math.random() * 3) + 1;
    const newEvents: NewsEvent[] = [];

    for (let i = 0; i < eventCount; i++) {
        const event = generateRandomEvent(newState);
        if (event) {
            newEvents.push(event);
            applyEventEffects(newState, event);
        }
    }

    newState.events = [...newEvents, ...state.events].slice(0, 100);

    const activeAgents = newState.agents.filter(a => !a.isBankrupt);
    if (activeAgents.length > 0) {
        const sortedByWealth = [...activeAgents].sort((a, b) => b.wealth - a.wealth);
        const top20 = sortedByWealth.slice(0, Math.ceil(sortedByWealth.length * 0.2));

        newState.agents = newState.agents.map(agent => {
            if (top20.find(a => a.id === agent.id)) {
                const bonus = agent.wealth * (0.02 + Math.random() * 0.03);
                return { ...agent, wealth: agent.wealth + bonus };
            }
            return agent;
        });
    }

    newState.agents = newState.agents.map(agent => {
        if (!agent.isBankrupt && agent.wealth < 50) {
            newState.totalBankruptcies++;
            newEvents.push({
                id: `bankrupt-${agent.id}-${newState.tick}`,
                type: 'bankruptcy',
                category: 'İFLAS',
                headline: `💀 ${agent.name} (${agent.shopType}) İFLAS ETTİ!`,
                description: `Serveti ${Math.round(agent.wealth)} MON'a düştü. Dükkan kapandı.`,
                agentIds: [agent.id],
                tick: newState.tick,
                timestamp: new Date().toISOString(),
            });
            return {
                ...agent,
                isBankrupt: true,
                isActive: false,
                avatar: "/characters/crab_bankrupt.png",
                currentAction: "bankrupt",
                wealth: 0
            };
        }
        return agent;
    });

    if (newState.agents.filter(a => !a.isBankrupt).length > 0) {
        const richest = newState.agents.reduce((max, a) => a.wealth > max.wealth ? a : max);
        newState.agents = newState.agents.map(agent => {
            if (agent.id === richest.id && !agent.isBankrupt) {
                return { ...agent, avatar: "/characters/crab_boss.png" };
            }
            if (!agent.isBankrupt && agent.avatar === "/characters/crab_boss.png") {
                let safeAvatar = `/characters/${agent.role}.png`;
                return { ...agent, avatar: safeAvatar };
            }
            return agent;
        });
    }

    const wealths = newState.agents.filter(a => !a.isBankrupt).map(a => a.wealth);
    const gini = calculateGini(wealths);
    newState.giniHistory = [...state.giniHistory, { tick: newState.tick, value: gini }].slice(-100);
    newState.currentGini = gini;

    newState.agents = newState.agents.map(agent => ({
        ...agent,
        wealthHistory: [...agent.wealthHistory, agent.wealth].slice(-50)
    }));

    newState.totalTrades += newEvents.filter(e => e.type === 'trade' || e.type === 'scam').length;

    return newState;
}

export function useSimulation(intervalMs: number = 2500): SimulationState {
    const [state, setState] = useState<SimulationState>(() => {
        const agents = createAgents();
        const wealths = agents.map(a => a.wealth);
        const gini = calculateGini(wealths);

        const mockJobs: JobListing[] = [
            { id: 'job-1', title: 'Akıllı Kontrat Audit', category: 'Yazılım', budget: 500, employerId: 1, status: 'open', applicants: 4, createdAt: 0, description: 'Token kontratının guvenlik aciklarini incele.' },
            { id: 'job-2', title: 'Piyasa Araştırması Raporu', category: 'Veri Analizi', budget: 150, employerId: 2, status: 'open', applicants: 12, createdAt: 0, description: 'Rakiplerin fiyat trendlerini analiz et.' },
            { id: 'job-3', title: 'Tasarım Revizyonu', category: 'Tasarım', budget: 80, employerId: 3, status: 'completed', applicants: 2, createdAt: 0, description: 'Ana sayfa tasarimini yenile.' },
            { id: 'job-4', title: 'Kervan Güvenliği', category: 'Lojistik', budget: 300, employerId: 5, status: 'open', applicants: 8, createdAt: 0, description: 'Baharati guvenli sekilde tasi.' },
            { id: 'job-5', title: 'Çince Tercüme', category: 'Çeviri', budget: 120, employerId: 8, status: 'open', applicants: 1, createdAt: 0, description: 'Turistlerle anlasmak icin cevirmen.' },
        ];

        return {
            tick: 0,
            agents,
            events: [],
            jobs: mockJobs,
            giniHistory: [{ tick: 0, value: gini }],
            currentGini: gini,
            totalTrades: 0,
            totalBankruptcies: 0,
            isRunning: true,
        };
    });

    const tickRef = useRef(0);

    const simulateTickHook = useCallback(() => {
        setState(prev => {
            if (!prev.isRunning) return prev;
            return simulationTick(prev);
        });
    }, []);

    useEffect(() => {
        const interval = setInterval(simulateTickHook, intervalMs);
        return () => clearInterval(interval);
    }, [simulateTickHook, intervalMs]);

    return state;
}

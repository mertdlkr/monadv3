// ============================================================
// NEXUS — 50 Crab Agent Data
// ============================================================
import { Agent, AgentRole, ShopType } from './types';

const TURKISH_NAMES = [
    'Mehmet', 'Fatma', 'Ahmet', 'Ayşe', 'Mustafa',
    'Zeynep', 'Ali', 'Emine', 'Hüseyin', 'Hatice',
    'Hasan', 'Elif', 'İbrahim', 'Merve', 'Yusuf',
    'Büşra', 'Kerim', 'Selin', 'Ömer', 'Derya',
    'Veli', 'Gamze', 'Murat', 'Esra', 'Osman',
    'Cansu', 'Emre', 'Deniz', 'Burak', 'Aslı',
    'Serkan', 'Gül', 'Tolga', 'Nisa', 'Kaan',
    'Pınar', 'Cem', 'Yasemin', 'Berk', 'Tuğçe',
    'Onur', 'Sibel', 'Uğur', 'Melis', 'Volkan',
    'Ebru', 'Altan', 'Defne', 'Tarık', 'İpek',
];

const SHOP_TYPES: ShopType[] = [
    'halici', 'kuyumcu', 'baharatci', 'dokumaci', 'antikaci',
    'hurdaci', 'bakirci', 'lokumcu', 'cini', 'deri',
];

const SHOP_LABELS: Record<ShopType, string> = {
    halici: 'Halıcı',
    kuyumcu: 'Kuyumcu',
    baharatci: 'Baharatçı',
    dokumaci: 'Dokumacı',
    antikaci: 'Antikacı',
    hurdaci: 'Hurdacı',
    bakirci: 'Bakırcı',
    lokumcu: 'Lokumcu',
    cini: 'Çinici',
    deri: 'Derici',
};

const ROLES: AgentRole[] = ['tezgahtar', 'simsar', 'kalpazan', 'aga', 'hamal', 'muhabir'];

const ROLE_LABELS: Record<AgentRole, string> = {
    tezgahtar: 'Tezgahtar',
    simsar: 'Simsar',
    kalpazan: 'Kalpazan',
    aga: 'Ağa',
    hamal: 'Hamal',
    muhabir: 'Muhabir',
};

// Character images mapped by role
const ROLE_AVATARS: Record<AgentRole, string> = {
    tezgahtar: '/characters/merchant.png',
    simsar: '/characters/broker.png',
    kalpazan: '/characters/trickster.png',
    aga: '/characters/crab_boss.png',
    hamal: '/characters/crab_worker.png',
    muhabir: '/characters/journalist.png',
};

const EMOJIS = ['🦀', '🦐', '🐙', '🐚', '🦞', '🐡', '🎣', '🐠', '🦑', '🐟'];

function seededRandom(seed: number) {
    let s = seed;
    return () => {
        s = (s * 16807) % 2147483647;
        return (s - 1) / 2147483646;
    };
}

export function createAgents(): Agent[] {
    const rng = seededRandom(42);

    return TURKISH_NAMES.map((name, i) => {
        const role = i === 0 ? 'aga' : ROLES[Math.floor(rng() * ROLES.length)];
        const shopType = SHOP_TYPES[i % SHOP_TYPES.length];
        const wealth = i === 0 ? 5000 : Math.floor(800 + rng() * 1200); // aga starts richer
        const reputation = i === 0 ? 5 : Math.round((2 + rng() * 3) * 10) / 10;

        return {
            id: i,
            name,
            emoji: EMOJIS[i % EMOJIS.length],
            role,
            shopType,
            shopName: `${name}'in ${SHOP_LABELS[shopType]}sı`,
            wealth,
            wealthHistory: [wealth],
            reputation: Math.min(5, reputation),
            status: 'active' as const,
            allies: [],
            trades: 0,
            avatar: ROLE_AVATARS[role],
        };
    });
}

export { SHOP_LABELS, ROLE_LABELS, ROLE_AVATARS };

// ============================================================
// NEXUS — 50 Agent Definitions
// ============================================================
import { Agent, AgentRole } from './types';

function seededRandom(seed: number) {
    let s = seed;
    return () => {
        s = (s * 16807) % 2147483647;
        return (s - 1) / 2147483646;
    };
}

const AGENT_DEFINITIONS = [
    // TEZGAHTARLAR (20 tane) — ana ekonomik aktörler
    { name: "Mehmet", role: "merchant", shopType: "Halı & Kilim", personality: "kurnaz", avatar: "/crabs/merchant.png" },
    { name: "Elif", role: "merchant", shopType: "Baharat", personality: "dürüst", avatar: "/crabs/merchant.png" },
    { name: "Ahmet", role: "merchant", shopType: "Çay & Kahve", personality: "sabırlı", avatar: "/crabs/merchant.png" },
    { name: "Zeynep", role: "merchant", shopType: "Tekstil", personality: "agresif", avatar: "/crabs/merchant.png" },
    { name: "Mustafa", role: "merchant", shopType: "Deri", personality: "geleneksel", avatar: "/crabs/merchant.png" },
    { name: "Fatma", role: "merchant", shopType: "Seramik", personality: "yaratıcı", avatar: "/crabs/merchant.png" },
    { name: "Emre", role: "merchant", shopType: "Lamba & Fener", personality: "showman", avatar: "/crabs/merchant.png" },
    { name: "Selin", role: "merchant", shopType: "Parfüm", personality: "ikna edici", avatar: "/crabs/merchant.png" },
    { name: "Burak", role: "merchant", shopType: "Takı", personality: "fırsatçı", avatar: "/crabs/merchant.png" },
    { name: "Deniz", role: "merchant", shopType: "Gıda", personality: "güvenilir", avatar: "/crabs/merchant.png" },
    { name: "Can", role: "merchant", shopType: "Elektronik", personality: "yenilikçi", avatar: "/crabs/merchant.png" },
    { name: "Aslı", role: "merchant", shopType: "Kitap", personality: "bilge", avatar: "/crabs/merchant.png" },
    { name: "Ozan", role: "merchant", shopType: "Müzik Aletleri", personality: "artistik", avatar: "/crabs/merchant.png" },
    { name: "Ece", role: "merchant", shopType: "Moda", personality: "trendci", avatar: "/crabs/merchant.png" },
    { name: "Kaan", role: "merchant", shopType: "Spor Malzemesi", personality: "enerjik", avatar: "/crabs/merchant.png" },
    { name: "Derya", role: "merchant", shopType: "Ev Dekorasyon", personality: "detaycı", avatar: "/crabs/merchant.png" },
    { name: "Tolga", role: "merchant", shopType: "Oto Yedek Parça", personality: "pragmatik", avatar: "/crabs/merchant.png" },
    { name: "İrem", role: "merchant", shopType: "Kozmetik", personality: "sosyal", avatar: "/crabs/merchant.png" },
    { name: "Serkan", role: "merchant", shopType: "İnşaat Malzeme", personality: "sert", avatar: "/crabs/merchant.png" },
    { name: "Naz", role: "merchant", shopType: "Çiçekçi", personality: "nazik", avatar: "/crabs/merchant.png" },

    // KUYUMCULAR (5 tane) — yüksek değerli ticaret
    { name: "Kemal", role: "jeweler", shopType: "Altın", personality: "ketum", avatar: "/crabs/jeweler.png" },
    { name: "Aylin", role: "jeweler", shopType: "Elmas", personality: "seçici", avatar: "/crabs/jeweler.png" },
    { name: "Hakan", role: "jeweler", shopType: "Gümüş", personality: "hesapçı", avatar: "/crabs/jeweler.png" },
    { name: "Pınar", role: "jeweler", shopType: "İnci", personality: "zarif", avatar: "/crabs/jeweler.png" },
    { name: "Cem", role: "jeweler", shopType: "Pırlanta", personality: "lüks", avatar: "/crabs/jeweler.png" },

    // BROKER / SİMSARLAR (5 tane) — komisyoncular
    { name: "Hasan", role: "broker", shopType: "Komisyoncu", personality: "fırsatçı", avatar: "/crabs/broker.png" },
    { name: "Gülay", role: "broker", shopType: "Emlakçı", personality: "ikna edici", avatar: "/crabs/broker.png" },
    { name: "Murat", role: "broker", shopType: "Borsa Aracı", personality: "risk sever", avatar: "/crabs/broker.png" },
    { name: "Sibel", role: "broker", shopType: "İthalat-İhracat", personality: "bağlantılı", avatar: "/crabs/broker.png" },
    { name: "Volkan", role: "broker", shopType: "Token Trader", personality: "spekülatör", avatar: "/crabs/broker.png" },

    // KALPAZANLAR (5 tane) — dolandırıcılar
    { name: "Yusuf", role: "trickster", shopType: "Antika (Sahte)", personality: "ikiyüzlü", avatar: "/crabs/trickster.png" },
    { name: "Berna", role: "trickster", shopType: "Sahte Marka", personality: "kaçak", avatar: "/crabs/trickster.png" },
    { name: "Cengiz", role: "trickster", shopType: "Sahte NFT", personality: "manipülatif", avatar: "/crabs/trickster.png" },
    { name: "Dilara", role: "trickster", shopType: "Ponzi Dükkan", personality: "karizmatik", avatar: "/crabs/trickster.png" },
    { name: "Erhan", role: "trickster", shopType: "Kopya Ürün", personality: "sinsi", avatar: "/crabs/trickster.png" },

    // TURİSTLER (5 tane) — kazıklanan yeni gelenler
    { name: "Tourist Bob", role: "tourist", shopType: "-", personality: "saf", avatar: "/crabs/tourist.png" },
    { name: "Tourist Alice", role: "tourist", shopType: "-", personality: "meraklı", avatar: "/crabs/tourist.png" },
    { name: "Tourist Hans", role: "tourist", shopType: "-", personality: "tedbirli", avatar: "/crabs/tourist.png" },
    { name: "Tourist Yuki", role: "tourist", shopType: "-", personality: "fotoğrafçı", avatar: "/crabs/tourist.png" },
    { name: "Tourist Maria", role: "tourist", shopType: "-", personality: "pazarlıkçı", avatar: "/crabs/tourist.png" },

    // ZABITALAR (3 tane) — denetçiler
    { name: "Ayşe", role: "officer", shopType: "-", personality: "adil", avatar: "/crabs/officer.png" },
    { name: "Kadir", role: "officer", shopType: "-", personality: "rüşvetçi", avatar: "/crabs/officer.png" },
    { name: "Leyla", role: "officer", shopType: "-", personality: "sert", avatar: "/crabs/officer.png" },

    // İŞÇİLER (5 tane) — taşımacı, hamal
    { name: "Ali", role: "worker", shopType: "Hamal", personality: "çalışkan", avatar: "/crabs/crab_worker.png" },
    { name: "Veli", role: "worker", shopType: "Kurye", personality: "hızlı", avatar: "/crabs/crab_worker.png" },
    { name: "Ömer", role: "worker", shopType: "Temizlikçi", personality: "sessiz", avatar: "/crabs/crab_worker.png" },
    { name: "Gül", role: "worker", shopType: "Garson", personality: "güler yüzlü", avatar: "/crabs/crab_worker.png" },
    { name: "Tarık", role: "worker", shopType: "Bekçi", personality: "sadık", avatar: "/crabs/crab_worker.png" },

    // FIRIN / YEMEK (2 tane)
    { name: "Hatice", role: "baker", shopType: "Fırın", personality: "geleneksel", avatar: "/crabs/baker.png" },
    { name: "İbrahim", role: "baker", shopType: "Lokanta", personality: "cömert", avatar: "/crabs/baker.png" },
];

export function createAgents(): Agent[] {
    const rng = seededRandom(12345); // deterministic positions

    return AGENT_DEFINITIONS.map((def, i) => {
        const posX = rng() * 90 + 5; // 5% to 95%
        const posY = rng() * 85 + 10; // 10% to 95%

        // Use existing `/characters/` directory to prevent broken images if `/crabs/` doesn't exist
        const safeAvatar = def.avatar.replace('/crabs/', '/characters/');

        return {
            id: i + 1,
            name: def.name,
            role: def.role as AgentRole,
            shopType: def.shopType,
            avatar: safeAvatar,
            personality: def.personality,
            wealth: 1000,
            initialWealth: 1000,
            reputation: Math.round((2 + rng() * 3) * 10) / 10,
            isActive: true,
            isBankrupt: false,
            isCartel: false,
            cartelId: null,
            allies: [],
            enemies: [],
            trades: 0,
            tradeHistory: [],
            wealthHistory: [1000],

            posX,
            posY,
            targetX: posX, // start stationary
            targetY: posY,
            isMoving: false,
            currentAction: "idle"
        };
    });
}

export const ROLE_LABELS: Record<string, string> = {
    merchant: 'Tüccar',
    jeweler: 'Kuyumcu',
    broker: 'Simsar',
    trickster: 'Kalpazan',
    tourist: 'Turist',
    officer: 'Zabıta',
    worker: 'İşçi',
    baker: 'Fırıncı'
};

export const SHOP_LABELS: Record<string, string> = new Proxy({}, {
    get: (target, name) => {
        if (typeof name !== 'string') return '';
        if (name === '-') return 'Gezgin / Yok';
        return name;
    }
});

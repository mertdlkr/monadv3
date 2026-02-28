// ============================================================
// NEXUS — The First AI Economy — Type Definitions
// ============================================================

export type AgentRole = 'merchant' | 'jeweler' | 'officer' | 'trickster' | 'tourist' | 'broker' | 'journalist' | 'baker' | 'antique_dealer' | 'worker';

export interface TradeRecord {
    partnerId: number;
    item: string;
    price: number;
    type: 'buy' | 'sell' | 'scam';
    tick: number;
}

export interface Agent {
    id: number;
    name: string;
    role: AgentRole;
    shopType: string;
    avatar: string;
    personality: string;
    wealth: number;
    initialWealth: number;
    reputation: number;
    isActive: boolean;
    isBankrupt: boolean;
    isCartel: boolean;
    cartelId: number | null;
    allies: number[];
    enemies: number[];
    trades: number; // Keep a simple counter for easy stats, or array of TradeRecord
    tradeHistory: TradeRecord[];
    wealthHistory: number[];

    // Harita için pozisyon
    posX: number; // 0-100 (yüzde)
    posY: number; // 0-100 (yüzde)
    targetX: number;
    targetY: number;
    isMoving: boolean;
    currentAction: string | null; // "trading", "walking", "bankrupt", "scheming"
}

export type EventType = 'trade' | 'scam' | 'cartel' | 'bankruptcy' | 'zabita' | 'guild' | 'monopoly' | 'ilan' | 'fight';
export type EventCategory = 'FLAŞ' | 'PİYASA' | 'İFLAS' | 'ZABITA' | 'İTTİFAK' | 'KARTEL' | 'TEKEL';

export interface NewsEvent {
    id: string;
    type: EventType;
    category: EventCategory;
    headline: string;
    description: string;
    agentIds: number[];
    tick: number;
    timestamp: string | Date; // Date is fine, but string easier for serialization if needed. Let's stick to number tick or simple string for now.
}

export interface JobListing {
    id: string;
    title: string;
    description: string;
    budget: number;              // MON
    employerId: number;
    category: string;
    status: 'open' | 'in-progress' | 'completed';
    applicants: number;
    createdAt: number;
}

export interface SimulationState {
    agents: Agent[];
    events: NewsEvent[];
    jobs: JobListing[];
    giniHistory: { tick: number; value: number }[];
    currentGini: number; // Derived from latest giniHistory value for easy access
    tick: number;
    totalTrades: number;
    totalBankruptcies: number;
    isRunning: boolean;
}


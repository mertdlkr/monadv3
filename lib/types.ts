// ============================================================
// NEXUS — The First AI Economy — Type Definitions
// ============================================================

export type AgentRole = 'tezgahtar' | 'simsar' | 'kalpazan' | 'aga' | 'hamal' | 'muhabir';

export type ShopType =
    | 'halici'
    | 'kuyumcu'
    | 'baharatci'
    | 'dokumaci'
    | 'antikaci'
    | 'hurdaci'
    | 'bakirci'
    | 'lokumcu'
    | 'cini'
    | 'deri';

export type AgentStatus = 'active' | 'bankrupt' | 'investigation' | 'hidden';

export interface Agent {
    id: number;
    name: string;
    emoji: string;
    role: AgentRole;
    shopType: ShopType;
    shopName: string;
    wealth: number;
    wealthHistory: number[];
    reputation: number;          // 0–5
    status: AgentStatus;
    allies: number[];            // ids of allied agents
    trades: number;
    avatar: string;              // path to crab character image
}

export type EventType =
    | 'trade'
    | 'scam'
    | 'cartel'
    | 'bankruptcy'
    | 'zabita'
    | 'guild'
    | 'monopoly'
    | 'ilan';

export interface NewsEvent {
    id: string;
    type: EventType;
    headline: string;
    description: string;
    agentIds: number[];
    timestamp: number;           // simulation tick
    amount?: number;
}

export interface Trade {
    seller: number;
    buyer: number;
    item: string;
    price: number;
    timestamp: number;
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
    tick: number;
    agents: Agent[];
    events: NewsEvent[];
    jobs: JobListing[];
    giniHistory: number[];
    currentGini: number;
    totalTrades: number;
    totalBankruptcies: number;
}

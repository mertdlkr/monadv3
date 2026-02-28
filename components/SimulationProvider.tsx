'use client';
// ============================================================
// NEXUS — Simulation Context Provider
// Shares a single simulation instance across all pages
// ============================================================
import React, { createContext, useContext } from 'react';
import { SimulationState } from '@/lib/types';
import { useSimulation } from '@/lib/useSimulation';

const SimulationContext = createContext<SimulationState | null>(null);

export function SimulationProvider({ children }: { children: React.ReactNode }) {
    const sim = useSimulation(2500);
    return (
        <SimulationContext.Provider value={sim}>
            {children}
        </SimulationContext.Provider>
    );
}

export function useSimContext(): SimulationState {
    const ctx = useContext(SimulationContext);
    if (!ctx) {
        throw new Error('useSimContext must be used within SimulationProvider');
    }
    return ctx;
}

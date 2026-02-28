'use client';

import { SimulationProvider } from '@/components/SimulationProvider';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    return (
        <SimulationProvider>
            <div className="relative z-10 flex flex-col min-h-screen">
                {children}
            </div>
        </SimulationProvider>
    );
}

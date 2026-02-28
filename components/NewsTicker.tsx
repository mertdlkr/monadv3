'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { NewsEvent } from '@/lib/types';

interface NewsTickerProps {
    events: NewsEvent[];
}

const EVENT_TYPE_EMOJI: Record<string, string> = {
    trade: '💰', scam: '🚨', cartel: '🤝', bankruptcy: '💀',
    zabita: '👮', guild: '⚔️', monopoly: '👑', ilan: '📋',
};

export default function NewsTicker({ events }: NewsTickerProps) {
    // We stabilize the list to exactly 10 items to prevent width jumps
    // when simulation events change size/count.
    const tickerItems = useMemo(() => {
        const slice = events.slice(0, 10);
        // Pad with dummy items if empty
        while (slice.length < 10) {
            slice.push({
                id: `dummy-${slice.length}`,
                headline: "NEXUS LIVE NETWORK STATUS: OPTIMAL",
                type: 'trade',
                timestamp: 0,
                description: "",
                agentIds: []
            });
        }
        return [...slice, ...slice];
    }, [events]);

    return (
        <div className="bg-nexus-primary border-b border-nexus-primary overflow-hidden py-1.5 whitespace-nowrap relative">
            <motion.div
                initial={{ x: 0 }}
                animate={{ x: "-50%" }}
                transition={{
                    duration: 80,
                    ease: "linear",
                    repeat: Infinity
                }}
                className="inline-flex items-center"
            >
                {tickerItems.map((ev, i) => (
                    <div
                        key={`${ev.id}-${i}`}
                        className="flex items-center gap-3 px-8 border-r border-black/10 min-w-[400px] max-w-[400px]"
                    >
                        <span className="text-2xl shrink-0">{EVENT_TYPE_EMOJI[ev.type] || '📌'}</span>
                        <span className="text-black font-terminal text-xl font-bold truncate">
                            {ev.headline}
                        </span>
                    </div>
                ))}
            </motion.div>

            {/* Visual Polish: Side Fades */}
            <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-nexus-primary via-nexus-primary/80 to-transparent z-10" />
            <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-nexus-primary via-nexus-primary/80 to-transparent z-10" />
        </div>
    );
}

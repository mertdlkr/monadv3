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

const BACKGROUND_NEWS = [
    "NEXUS AĞI BAŞARIYLA BAŞLATILDI...",
    "MONAD BLOCKCHAIN GECİKME SÜRESİ 1MS ALTINDA...",
    "MERKEZ BANKASI FAİZ KARARINI AÇIKLADI: DEĞİŞİKLİK YOK...",
    "SİBER GÜVENLİK UZMANLARINDAN YENİ YAZILIM UYARISI...",
    "BORSADA İŞLEM HACMİ TÜM ZAMANLARIN ZİRVESİNDE...",
    "YENİ TİCARET YOLLARI İÇİN GÖRÜŞMELER BAŞLADI...",
    "YAPAY ZEKA TÜCCARLARI PİYASAYI DOMİNE EDİYOR...",
    "OTONOM TESLİMAT DRONLARI HİZMETE GİRDİ...",
    "ENERJİ FİYATLARINDAKİ DÜŞÜŞ ÜRETİMİ HIZLANDIRDI...",
    "VERİ MERKEZLERİ KAPASİTE ARTIRIMINA GİDİYOR..."
];

export default function NewsTicker({ events }: NewsTickerProps) {
    // Stabilize the list to exactly 40 items to prevent width jumps
    // padding with realistic background news.
    const tickerItems = useMemo(() => {
        const slice = [...events].slice(0, 40);

        let dummyCounter = 0;
        // Pad with realistic background news if empty or less than 40
        while (slice.length < 40) {
            slice.push({
                id: `bg-${dummyCounter}`,
                headline: BACKGROUND_NEWS[dummyCounter % BACKGROUND_NEWS.length],
                type: 'trade',
                timestamp: 0,
                description: "",
                agentIds: []
            });
            dummyCounter++;
        }
        return [...slice, ...slice];
    }, [events]);

    return (
        <div className="bg-nexus-primary border-b border-nexus-primary overflow-hidden py-1.5 whitespace-nowrap relative">
            <motion.div
                initial={{ x: 0 }}
                animate={{ x: "-50%" }}
                transition={{
                    duration: 200, // Very slow, seamless presentation flow
                    ease: "linear",
                    repeat: Infinity
                }}
                className="inline-flex items-center"
            >
                {tickerItems.map((ev, i) => (
                    <div
                        key={i} // Using index to prevent unmounting/remounting DOM nodes (eliminates micro-stutters)
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

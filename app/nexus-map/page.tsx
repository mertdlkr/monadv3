"use client";
import { useSimContext } from '@/components/SimulationProvider';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';
import { Agent } from '@/lib/types';
import Navbar from '@/components/Navbar';

function getGiniColor(gini: number): string {
    if (gini < 0.3) return '#00ff88'; // yeşil 
    if (gini < 0.45) return '#ffd700'; // altın
    if (gini < 0.6) return '#ff6b35'; // turuncu
    return '#ff2d55'; // kırmızı
}

function findNearbyAgents(agents: Agent[], thresholdPercentage: number): [Agent, Agent][] {
    const pairs: [Agent, Agent][] = [];
    const activeAgents = agents.filter(a => !a.isBankrupt);
    for (let i = 0; i < activeAgents.length; i++) {
        for (let j = i + 1; j < activeAgents.length; j++) {
            const a1 = activeAgents[i];
            const a2 = activeAgents[j];
            const dx = a1.posX - a2.posX;
            const dy = a1.posY - a2.posY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < thresholdPercentage) {
                pairs.push([a1, a2]);
            }
        }
    }
    return pairs;
}

export default function NexusMap() {
    const sim = useSimContext();
    const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
    const [hoveredAgent, setHoveredAgent] = useState<Agent | null>(null);

    // Reverse events to show the newest events effectively, though they should be unshifted in simulation.
    // The useSimulation loop prepends to events using unshift implicitly by `[...newEvents, ...prev]`, so slice(0,3) are latest.
    const recentEvents = sim.events.slice(0, 5);
    const nearbyPairs = findNearbyAgents(sim.agents, 12);
    const currentGini = sim.currentGini;

    let richestId = -1;
    const active = sim.agents.filter(a => !a.isBankrupt);
    if (active.length > 0) {
        richestId = active.reduce((max, a) => a.wealth > max.wealth ? a : max).id;
    }

    return (
        <div className="flex flex-col h-screen w-full bg-[#0a0a1a] overflow-hidden text-[#e0e0e0] font-sans selection:bg-[#00ff88]/30">
            <Navbar />
            <div className="relative flex-1 w-full overflow-hidden">
                {/* Üst Bar */}
                <div className="absolute top-0 left-0 right-0 z-20 flex justify-between items-center px-6 py-3 bg-gradient-to-b from-[#0a0a1a] via-[#0a0a1a]/80 to-transparent">
                    <div className="flex items-center gap-3">
                        <span className="text-[#00ff88] font-bold text-sm tracking-widest drop-shadow-[0_0_8px_rgba(0,255,136,0.6)]">NEXUS HARİTASI</span>
                        <span className="w-2.5 h-2.5 rounded-full bg-[#00ff88] animate-pulse shadow-[0_0_10px_#00ff88]" />
                        <span className="text-gray-400 text-xs text-opacity-80">CANLI YAYIN</span>
                    </div>
                    <div className="text-gray-300 text-xs font-mono bg-black/40 px-4 py-1.5 rounded-full border border-white/5 backdrop-blur-sm">
                        TICK: <span className="text-white">{sim.tick}</span> <span className="mx-2 text-white/20">|</span>
                        AKTİF: <span className="text-[#00ff88]">{active.length}</span> <span className="mx-2 text-white/20">|</span>
                        İFLAS: <span className="text-[#ff2d55]">{sim.totalBankruptcies}</span>
                    </div>
                    <div className="text-xs font-mono font-bold bg-black/40 px-4 py-1.5 rounded-full shadow-inner border border-white/5" style={{ color: getGiniColor(currentGini) }}>
                        GİNİ İNDEKSİ: {currentGini.toFixed(3)}
                    </div>
                </div>

                {/* Grid arka plan */}
                <div className="absolute inset-0 opacity-10 pointer-events-none"
                    style={{
                        backgroundImage: 'linear-gradient(rgba(0, 255, 136, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 136, 0.2) 1px, transparent 1px)',
                        backgroundSize: '80px 80px',
                        backgroundPosition: 'center center'
                    }}
                />

                {/* Bölge isimleri - Arka Plan Dekoru */}
                <div className="absolute top-[15%] left-[10%] text-[#00ff88] opacity-[0.03] font-black text-6xl tracking-widest uppercase pointer-events-none rotate-[-15deg]">KUYUMCULAR</div>
                <div className="absolute top-[15%] right-[10%] text-[#00ff88] opacity-[0.03] font-black text-6xl tracking-widest uppercase pointer-events-none rotate-[10deg]">BAHARAT YOLU</div>
                <div className="absolute bottom-[20%] left-[10%] text-[#ff6b35] opacity-[0.03] font-black text-6xl tracking-widest uppercase pointer-events-none rotate-[5deg]">KARANLIK SOKAK</div>
                <div className="absolute bottom-[20%] right-[10%] text-[#ffd700] opacity-[0.03] font-black text-6xl tracking-widest uppercase pointer-events-none rotate-[-5deg]">TURİST ALANI</div>
                <div className="absolute top-[45%] left-[40%] text-[#00ff88] opacity-[0.05] font-black text-8xl tracking-widest uppercase pointer-events-none">MEYDAN</div>

                {/* Trade çizgileri (yakın agent'lar arası) */}
                <svg className="absolute inset-0 z-10 pointer-events-none w-full h-full opacity-60">
                    {nearbyPairs.map(([a1, a2], i) => (
                        <line key={`line-${i}`}
                            x1={`${a1.posX}%`} y1={`${a1.posY}%`}
                            x2={`${a2.posX}%`} y2={`${a2.posY}%`}
                            stroke={a1.isCartel && a2.isCartel ? "#ff6b35" : "#ffd700"}
                            strokeWidth={a1.isCartel && a2.isCartel ? "3" : "1.5"}
                            strokeDasharray="4,6"
                            className="animate-pulse"
                        />
                    ))}
                </svg>

                {/* Agent'lar */}
                <AnimatePresence>
                    {sim.agents.map(agent => (
                        <motion.div
                            key={agent.id}
                            className="absolute z-10 flex flex-col items-center cursor-pointer group"
                            style={{
                                x: '-50%',
                                y: '-50%'
                            }}
                            initial={{ left: `${agent.posX}%`, top: `${agent.posY}%` }}
                            animate={{
                                left: `${agent.posX}%`,
                                top: `${agent.posY}%`,
                            }}
                            transition={{ duration: 2.5, ease: "linear" }}
                            onClick={() => setSelectedAgent(agent)}
                            onMouseEnter={() => setHoveredAgent(agent)}
                            onMouseLeave={() => setHoveredAgent(null)}
                        >
                            {/* Status overlays */}
                            {agent.id === richestId && !agent.isBankrupt && (
                                <motion.span
                                    initial={{ y: -10, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    className="absolute -top-7 text-2xl drop-shadow-[0_0_10px_#ffd700] z-20"
                                >
                                    👑
                                </motion.span>
                            )}
                            {agent.isBankrupt && <span className="absolute -top-6 text-xl opacity-80 z-20">💀</span>}

                            {/* Agent avatar Container */}
                            <div className={`relative w-14 h-14 transition-all duration-300 
                            ${agent.isBankrupt ? 'grayscale opacity-40 scale-75' : 'group-hover:scale-110'} 
                            ${agent.isCartel && !agent.isBankrupt ? 'ring-2 ring-[#ff6b35] shadow-[0_0_20px_rgba(255,107,53,0.8)] animate-pulse rounded-full' : ''}`}>
                                <Image src={agent.avatar} alt={agent.name} fill className="object-contain drop-shadow-xl" sizes="56px" />
                            </div>

                            {/* Name + wealth mini label */}
                            <div className={`bg-[#0a0a1a]/90 backdrop-blur-sm px-2.5 py-1 rounded flex flex-col items-center mt-1 border transition-all
                            ${agent.isBankrupt ? 'border-red-900/30' : 'border-white/10 group-hover:border-[#00ff88]/50'}`}>
                                <span className={`text-[11px] whitespace-nowrap font-medium ${agent.isBankrupt ? 'text-gray-600' : 'text-gray-200'}`}>
                                    {agent.name}
                                </span>
                                <span className={`text-[10px] font-mono mt-0.5 
                                ${agent.wealth > agent.initialWealth && !agent.isBankrupt ? 'text-[#00ff88]' :
                                        agent.isBankrupt ? 'text-red-900/50 line-through' : 'text-gray-400'}`}>
                                    {Math.round(agent.wealth)}
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {/* Hover tooltip */}
                <AnimatePresence>
                    {hoveredAgent && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.1 }}
                            className="fixed z-50 bg-[#151525]/95 backdrop-blur border border-white/20 p-5 rounded-xl shadow-2xl pointer-events-none min-w-[220px]"
                            style={{
                                left: `min(calc(100vw - 250px), calc(${hoveredAgent.posX}vw + 40px))`,
                                top: `min(calc(100vh - 200px), calc(${hoveredAgent.posY}vh - 50px))`
                            }}>
                            <div className="text-[#ffd700] font-bold text-xl border-b border-white/10 pb-2 mb-3 drop-shadow-[0_0_5px_rgba(255,215,0,0.5)]">
                                {hoveredAgent.name}
                            </div>
                            <div className="space-y-1.5">
                                <div className="text-sm text-gray-300 capitalize flex justify-between"><span className="text-gray-500 mr-4">Rol:</span> <span className="font-medium text-white">{hoveredAgent.role}</span></div>
                                <div className="text-sm text-gray-300 flex justify-between"><span className="text-gray-500 mr-4">Mekan:</span> <span className="font-medium text-white">{hoveredAgent.shopType === '-' ? 'Yok' : hoveredAgent.shopType}</span></div>
                                <div className="text-sm text-gray-300 capitalize flex justify-between"><span className="text-gray-500 mr-4">Karakter:</span> <span className="font-medium text-white">{hoveredAgent.personality}</span></div>
                            </div>

                            <div className="flex justify-between items-center mt-4 pt-3 border-t border-white/10">
                                <span className="text-xs text-gray-400 font-mono">NET DEĞER</span>
                                <div className="text-lg font-mono font-bold" style={{ color: hoveredAgent.wealth >= hoveredAgent.initialWealth ? '#00ff88' : '#ff2d55' }}>
                                    {Math.round(hoveredAgent.wealth)} <span className="text-[10px] text-gray-500 ml-0.5">MON</span>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Alt event bar */}
                <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-[#0a0a1a] via-[#0a0a1a]/80 to-transparent pt-12 pb-5 px-6">
                    <div className="flex gap-4 overflow-x-auto no-scrollbar scroll-smooth snap-x">
                        <AnimatePresence>
                            {recentEvents.map(event => (
                                <motion.div
                                    key={event.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-[13px] whitespace-nowrap px-4 py-2 rounded-lg border border-white/10 bg-black/60 text-gray-200 shadow-xl backdrop-blur-md snap-start flex-shrink-0"
                                >
                                    <span className={`${event.category === 'İFLAS' || event.category === 'ZABITA' ? 'text-[#ff2d55]' : event.category === 'FLAŞ' || event.category === 'KARTEL' ? 'text-[#ff6b35]' : 'text-[#00ff88]'} font-bold mr-2 drop-shadow-[0_0_5px_currentColor]`}>
                                        [{event.category}]
                                    </span>
                                    {event.headline}
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Extended Agent Modal (Focus View) */}
                <AnimatePresence>
                    {selectedAgent && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
                            onClick={() => setSelectedAgent(null)}
                        >
                            <motion.div
                                initial={{ scale: 0.95, y: 20, opacity: 0 }}
                                animate={{ scale: 1, y: 0, opacity: 1 }}
                                exit={{ scale: 0.95, y: 20, opacity: 0 }}
                                className="bg-gradient-to-b from-[#1a1a2e] to-[#0a0a1a] border border-[#00ff88]/20 p-8 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.8)] max-w-md w-full relative overflow-hidden"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#00ff88] to-transparent opacity-50"></div>

                                <button onClick={() => setSelectedAgent(null)} className="absolute top-4 right-5 text-gray-500 hover:text-white transition-colors text-xl">
                                    ✕
                                </button>

                                <div className="flex flex-col items-center mb-8 relative">
                                    {selectedAgent.id === richestId && !selectedAgent.isBankrupt && <span className="absolute -top-8 text-4xl animate-bounce drop-shadow-[0_0_15px_#ffd700] z-10">👑</span>}
                                    <div className={`w-32 h-32 relative mb-5 bg-black/40 rounded-full border-4 overflow-hidden flex items-center justify-center shadow-inner
                                    ${selectedAgent.isBankrupt ? 'border-red-900/50' : selectedAgent.isCartel ? 'border-[#ff6b35]' : 'border-[#00ff88]/30'}`}>
                                        <Image src={selectedAgent.avatar} alt={selectedAgent.name} fill className={`object-contain p-4 drop-shadow-2xl ${selectedAgent.isBankrupt ? 'grayscale opacity-60' : ''}`} sizes="128px" />
                                    </div>
                                    <h2 className="text-4xl font-black text-white tracking-widest drop-shadow-md">{selectedAgent.name}</h2>
                                </div>

                                <div className="bg-black/30 rounded-xl p-5 border border-white/5 space-y-4 text-sm mb-6">
                                    <div className="flex justify-between items-center border-b border-white/5 pb-3">
                                        <span className="text-gray-500 font-mono tracking-wider text-xs">STATÜ</span>
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${selectedAgent.isBankrupt ? 'bg-red-900/20 text-[#ff2d55] border-red-900/50' : 'bg-[#00ff88]/10 text-[#00ff88] border-[#00ff88]/30'}`}>
                                            {selectedAgent.isBankrupt ? 'İFLAS ETTİ' : 'AKTİF'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center border-b border-white/5 pb-3">
                                        <span className="text-gray-500 font-mono tracking-wider text-xs">SERVET</span>
                                        <span className="text-[#00ff88] font-mono text-xl">{Math.round(selectedAgent.wealth).toLocaleString()} <span className="text-xs text-gray-500 ml-1">MON</span></span>
                                    </div>
                                    <div className="flex justify-between items-center border-b border-white/5 pb-3">
                                        <span className="text-gray-500 font-mono tracking-wider text-xs">KİMLİK</span>
                                        <span className="text-gray-200 capitalize font-medium">{selectedAgent.role}</span>
                                    </div>
                                    <div className="flex justify-between items-center border-b border-white/5 pb-3">
                                        <span className="text-gray-500 font-mono tracking-wider text-xs">MÜLK</span>
                                        <span className="text-gray-200 font-medium">{selectedAgent.shopType === '-' ? 'Yok' : selectedAgent.shopType}</span>
                                    </div>
                                    <div className="flex justify-between items-center pb-1">
                                        <span className="text-gray-500 font-mono tracking-wider text-xs">TİCARET HACMİ</span>
                                        <span className="text-[#ffd700] font-mono font-bold">{selectedAgent.trades} İŞLEM</span>
                                    </div>
                                </div>

                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

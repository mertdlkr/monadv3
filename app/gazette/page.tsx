'use client';

import Navbar from '@/components/Navbar';
import { useSimContext } from '@/components/SimulationProvider';
import { EventType } from '@/lib/types';

// The new vintage config mappings
const EVENT_TYPE_CONFIG: Record<EventType, { label: string; colorClass: string; icon: string }> = {
    trade: { label: 'PİYASA', colorClass: 'text-vtg-primary', icon: 'trending_up' },
    scam: { label: 'DOLANDIRICILIK', colorClass: 'text-vtg-accent-red', icon: 'warning' },
    cartel: { label: 'KARTEL', colorClass: 'text-purple-800', icon: 'group' },
    bankruptcy: { label: 'İFLAS', colorClass: 'text-ink', icon: 'skull' },
    zabita: { label: 'ZABITA', colorClass: 'text-vtg-accent-blue', icon: 'security' },
    guild: { label: 'İTTİFAK', colorClass: 'text-vtg-accent-green', icon: 'handshake' },
    monopoly: { label: 'TEKEL', colorClass: 'text-orange-800', icon: 'crown' },
    ilan: { label: 'İLAN', colorClass: 'text-slate-600', icon: 'campaign' },
    fight: { label: 'MEYDAN KAVGASI', colorClass: 'text-vtg-accent-red', icon: 'sports_mma' },
};

export default function GazettePage() {
    const sim = useSimContext();

    const topAgents = [...sim.agents]
        .filter(a => !a.isBankrupt)
        .sort((a, b) => b.wealth - a.wealth)
        .slice(0, 5);

    const bankruptAgents = sim.agents
        .filter(a => a.isBankrupt)
        .slice(0, 5);

    const maxWealth = topAgents[0]?.wealth || 1;

    // Feature up to 4 additional events
    const secondaryEvents = sim.events.slice(1, 5);

    return (
        <div className="bg-paper text-ink font-body min-h-screen relative overflow-x-hidden selection:bg-vtg-primary/30">
            <Navbar />

            {/* Paper Texture Overlay */}
            <div className="fixed inset-0 pointer-events-none z-30 bg-paper-texture opacity-40 mix-blend-multiply" />

            <div className="relative max-w-[1200px] mx-auto px-4 md:px-8 py-6 z-10 flex flex-col gap-8">
                {/* Header / Masthead */}
                <header className="flex flex-col gap-4 border-b-4 border-double border-ink pb-6 mb-4 mt-4">
                    <div className="flex flex-col md:flex-row justify-between items-center border-b border-ink/20 pb-2">
                        <div className="text-sm font-bold tracking-widest uppercase text-ink/60">İstanbul, Türkiye</div>
                        <div className="flex items-center gap-4 text-sm font-bold tracking-widest text-ink/60">
                            <span>12 Aralık 2030</span>
                            <span className="w-1 h-1 bg-vtg-primary rounded-full"></span>
                            <span>Blok #{8932102 + sim.tick}</span>
                        </div>
                    </div>
                    <div className="flex flex-col items-center justify-center py-4 relative">
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1/4 h-[2px] bg-gradient-to-r from-transparent via-vtg-primary to-transparent hidden md:block"></div>
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1/4 h-[2px] bg-gradient-to-r from-transparent via-vtg-primary to-transparent hidden md:block"></div>
                        <h1 className="text-6xl md:text-8xl font-masthead font-black text-ink tracking-tighter text-center leading-none drop-shadow-sm">
                            ÇARŞI GAZETESİ
                        </h1>
                        <p className="font-headline italic text-lg text-vtg-primary font-semibold mt-2">&quot;Hakikat, Ticaret ve Adalet&quot;</p>
                    </div>
                    <nav className="flex flex-wrap justify-center gap-6 md:gap-12 py-3 border-t-2 border-b-2 border-ink border-double">
                        <span className="font-bold hover:text-vtg-primary transition-colors uppercase tracking-widest text-sm flex items-center gap-1 group cursor-pointer">
                            <span className="material-symbols-outlined group-hover:scale-110 transition-transform text-vtg-accent-red">bolt</span> FLAŞ
                        </span>
                        <span className="font-bold hover:text-vtg-primary transition-colors uppercase tracking-widest text-sm flex items-center gap-1 group cursor-pointer">
                            <span className="material-symbols-outlined group-hover:scale-110 transition-transform text-vtg-primary">trending_up</span> PİYASA
                        </span>
                        <span className="font-bold hover:text-vtg-primary transition-colors uppercase tracking-widest text-sm flex items-center gap-1 group cursor-pointer">
                            <span className="material-symbols-outlined group-hover:scale-110 transition-transform text-ink">skull</span> İFLAS
                        </span>
                        <span className="font-bold hover:text-vtg-primary transition-colors uppercase tracking-widest text-sm flex items-center gap-1 group cursor-pointer">
                            <span className="material-symbols-outlined group-hover:scale-110 transition-transform text-vtg-accent-blue">security</span> ZABITA
                        </span>
                        <span className="font-bold hover:text-vtg-primary transition-colors uppercase tracking-widest text-sm flex items-center gap-1 group cursor-pointer">
                            <span className="material-symbols-outlined group-hover:scale-110 transition-transform text-vtg-accent-green">handshake</span> İTTİFAK
                        </span>
                    </nav>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Main Content (Left Column) */}
                    <main className="lg:col-span-8 flex flex-col gap-8">
                        {/* Hero Article */}
                        {sim.events[0] && (
                            <article className="flex flex-col gap-4 border-b border-ink/20 pb-8">
                                <div className="relative w-full h-[400px] bg-ink rounded-sm overflow-hidden border-4 border-double border-vtg-sepia-dark shadow-md group cursor-pointer">
                                    <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                                        style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuArvagda73dIvDG2_pC6cWHTdPQSy6Xcs50W24J0ovnRu0mOEhfUxuxmmciyMhzKM9g7o45GASRbh5jnErtjrkLLJ7om4Z5coxwbJRAakaZQOgCsFHA_tJ_bxBgWcw4sGvYXBZWXxUoQLoZZV2oa2xaf53OIo7gnu0qeRjgxApG-o-XbWQMxjmf9c0-df66fT7_XLjsZ2DwxoIX9Fz3MXz1uYFHnkP1D-s8Oa6K2mg_OPsqSNG9kuHn4kOwZFdLVpslu9oPCSWu3zj3")' }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-transparent"></div>
                                    <div className="absolute bottom-0 left-0 p-6 md:p-8 flex flex-col gap-3 max-w-3xl">
                                        <span className="bg-vtg-accent-red text-white text-xs font-bold px-2 py-1 uppercase tracking-widest w-fit">FLAŞ HABER</span>
                                        <h2 className="text-3xl md:text-5xl font-headline font-bold text-paper leading-tight drop-shadow-lg">
                                            {sim.events[0].headline}
                                        </h2>
                                        <div className="flex items-center gap-3 text-paper/80 text-sm font-medium">
                                            <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">schedule</span> Tick {String(sim.events[0].timestamp)}</span>
                                            <span>•</span>
                                            <span>Yazar: Otomat-7</span>
                                        </div>
                                    </div>
                                </div>
                                <p className="drop-cap text-lg leading-relaxed text-justify text-ink/90 font-serif">
                                    {sim.events[0].description} Pazardaki yankıları sürmeye devam ederken, esnaf arasında dedikodular alıp başını yürüdü. Altın fiyatlarında hareketlenme bekleniyor.
                                </p>
                            </article>
                        )}

                        {/* Secondary Articles Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {secondaryEvents.map((evt, idx) => {
                                const config = EVENT_TYPE_CONFIG[evt.type] || EVENT_TYPE_CONFIG.trade;
                                return (
                                    <article key={idx} className="flex flex-col gap-3 bg-vtg-sepia-light p-4 border border-vtg-sepia-dark rounded-sm vintage-box-shadow hover:bg-vtg-sepia-dark/50 transition-colors cursor-pointer">
                                        <div className="flex justify-between items-start">
                                            <span className={`${config.colorClass} font-bold text-xs tracking-widest uppercase border-b border-current pb-0.5`}>{config.label}</span>
                                            <span className="text-ink/50 text-xs italic">Tick {String(evt.timestamp)}</span>
                                        </div>
                                        <h3 className="text-xl font-headline font-bold text-ink leading-tight">{evt.headline}</h3>
                                        <p className="text-sm text-ink/80 line-clamp-3">
                                            {evt.description}
                                        </p>
                                    </article>
                                );
                            })}
                        </div>

                        {/* Horizontal Image Article */}
                        <article className="flex flex-col md:flex-row gap-6 items-center bg-white border border-vtg-sepia-dark p-6 vintage-box-shadow">
                            <div className="w-full md:w-1/3 h-48 bg-cover bg-center grayscale contrast-125 sepia" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuABhWYdJ6sU1PzOxRVexQavo5DeKFHtzGanOWoLq8fdWqBYkKCEXAFd9l0FoANBIb-6l-3hN1QpjyyJov-7zVOU1RIHKrw-X9ThDpj9sYHKb8Z5bu56_LPdKkiu_tslEphoRTLsVH5RWMXEiZqyXVP7O3dSfnlfv9uzhNLyo11wTaTu1mN7Xmcerh9VAVpoEmJKPSWwt7pLnnjcr5r53vtmgxSwcq0kXM67l6VnYqKblGk7s_AVNnM7LLsONBNnhekGwisrPVdC5IFk")' }}></div>
                            <div className="flex-1 flex flex-col gap-3">
                                <span className="text-vtg-primary font-bold text-xs tracking-widest uppercase w-fit">PİYASA ANALİZİ</span>
                                <h3 className="text-2xl font-headline font-bold text-ink">Altın Fiyatlarında Beklenmedik Sıçrama</h3>
                                <p className="text-ink/80 font-serif leading-relaxed">
                                    Son bloklarda yaşanan belirsizlik, yatırımcıları güvenli liman altına yöneltti. Uzmanlar bu yükselişin geçici olabileceği konusunda uyarıyor ancak talep artmaya devam ediyor. Çarşı esnafı, fiyat etiketlerini saat başı değiştiriyor.
                                </p>
                            </div>
                        </article>
                    </main>

                    {/* Sidebar (Right Column) */}
                    <aside className="lg:col-span-4 flex flex-col gap-8">
                        {/* Gini Gauge Widget */}
                        <div className="bg-ink text-paper p-6 border-4 border-double border-vtg-primary relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-2 opacity-10">
                                <span className="material-symbols-outlined text-9xl">speed</span>
                            </div>
                            <h3 className="font-masthead font-bold text-xl border-b border-vtg-primary/30 pb-2 mb-4 text-center">GİNİ KATSAYISI</h3>
                            <div className="relative h-32 w-full flex items-end justify-center mb-2">
                                {/* Semi-circle gauge background */}
                                <div className="w-48 h-24 rounded-t-full border-[16px] border-gray-700 relative overflow-hidden">
                                    {/* Colored segments */}
                                    <div className="absolute bottom-0 left-0 w-full h-full rounded-t-full border-[16px] border-l-transparent border-b-transparent border-r-transparent border-t-vtg-accent-red" style={{ transform: 'rotate(-45deg)', transformOrigin: 'center bottom' }}></div>
                                </div>
                                {/* Needle */}
                                <div className="absolute bottom-0 left-1/2 w-1 h-24 bg-vtg-primary origin-bottom transition-transform duration-1000" style={{ transform: `translateX(-50%) rotate(${(sim.currentGini * 180) - 90}deg)` }}></div>
                                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-4 h-4 bg-vtg-primary rounded-full z-10"></div>
                            </div>
                            <div className="text-center pt-4">
                                <span className="text-5xl font-bold font-headline text-vtg-accent-red block">{sim.currentGini.toFixed(2)}</span>
                                <span className="text-xs uppercase tracking-widest text-vtg-primary font-bold mt-1 block">
                                    {sim.currentGini > 0.6 ? 'TEHLİKELİ BÖLGE' : sim.currentGini > 0.4 ? 'DİKKAT EDİLMELİ' : 'DENGELİ'}
                                </span>
                                <p className="text-xs text-paper/60 mt-2 font-serif italic">
                                    {sim.currentGini > 0.5 ? 'Gelir adaletsizliği kritik seviyede.' : 'Piyasada adil bir paylaşım söz konusu.'}
                                </p>
                            </div>
                        </div>

                        {/* Key Stats Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white border border-ink/20 p-4 text-center flex flex-col gap-1 vintage-box-shadow">
                                <span className="text-xs font-bold uppercase text-ink/50">Toplam Ticaret</span>
                                <span className="text-3xl font-headline font-bold text-ink">{sim.totalTrades}</span>
                                <span className="text-xs font-bold text-vtg-accent-green flex justify-center items-center">
                                    <span className="material-symbols-outlined text-sm">trending_up</span> Canlı
                                </span>
                            </div>
                            <div className="bg-white border border-ink/20 p-4 text-center flex flex-col gap-1 vintage-box-shadow">
                                <span className="text-xs font-bold uppercase text-ink/50">İflas Sayısı</span>
                                <span className="text-3xl font-headline font-bold text-ink">{sim.totalBankruptcies}</span>
                                <span className="text-xs font-bold text-vtg-accent-red flex justify-center items-center">
                                    <span className="material-symbols-outlined text-sm">warning</span> Kayıt
                                </span>
                            </div>
                        </div>

                        {/* Top 5 Leaderboard */}
                        <div className="border-2 border-ink p-1 bg-vtg-sepia-light">
                            <div className="border border-ink p-4 flex flex-col gap-4">
                                <h3 className="font-masthead font-bold text-xl text-center border-b border-ink/20 pb-2">EN ZENGİN 5</h3>
                                <div className="flex flex-col gap-4">
                                    {topAgents.map((agent, i) => (
                                        <div key={agent.id} className="flex flex-col gap-1">
                                            <div className="flex justify-between items-end text-sm font-bold text-ink">
                                                <span>{i + 1}. {agent.name}</span>
                                                <span>₺{(agent.wealth).toLocaleString()}</span>
                                            </div>
                                            <div className="w-full h-3 bg-ink/10 rounded-full overflow-hidden">
                                                <div className="h-full bg-vtg-primary transition-all duration-500" style={{ width: `${Math.max(5, (agent.wealth / maxWealth) * 100)}%`, opacity: 1 - (i * 0.15) }}></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Recent Bankruptcies List */}
                        <div className="bg-ink text-vtg-sepia-light p-6 rounded-sm shadow-inner flex flex-col gap-4">
                            <div className="flex items-center gap-2 border-b border-vtg-sepia-light/20 pb-2">
                                <span className="material-symbols-outlined text-vtg-sepia-light">skull</span>
                                <h3 className="font-headline font-bold text-lg">SON İFLASLAR</h3>
                            </div>
                            <ul className="flex flex-col gap-3">
                                {bankruptAgents.map(agent => (
                                    <li key={agent.id} className="flex items-center justify-between group cursor-pointer">
                                        <span className="text-sm font-serif group-hover:text-vtg-primary transition-colors">{agent.name}</span>
                                        <span className="text-xs opacity-50">Kapalı</span>
                                    </li>
                                ))}
                                {bankruptAgents.length === 0 && (
                                    <li className="text-sm font-serif text-white/50 italic">Kayıtlara geçen iflas bulunmamaktadır.</li>
                                )}
                            </ul>
                        </div>

                        {/* Ad Space / Fun Element */}
                        <div className="border border-dashed border-ink/40 p-4 flex flex-col items-center justify-center gap-2 text-center bg-transparent mt-auto">
                            <p className="font-masthead font-bold text-sm text-ink/60">REKLAM</p>
                            <p className="font-headline italic text-lg text-ink">&quot;En İyi Halılar Kapalıçarşı No: 42'de&quot;</p>
                            <button className="bg-ink text-paper text-xs px-4 py-1 hover:bg-vtg-primary hover:text-ink transition-colors uppercase tracking-wider font-bold mt-2">Ziyaret Et</button>
                        </div>
                    </aside>
                </div>

                {/* Footer */}
                <footer className="mt-12 border-t-4 border-double border-ink pt-8 pb-12 text-center flex flex-col gap-4">
                    <div className="flex justify-center items-center gap-2 text-ink/60">
                        <span className="material-symbols-outlined">newspaper</span>
                        <span className="font-masthead font-bold text-lg">ÇARŞI GAZETESİ</span>
                    </div>
                    <p className="text-ink/60 text-sm font-serif">© 2030 Çarşı A.Ş. Tüm hakları saklıdır. Yapay Zeka tarafından oluşturulmuştur.</p>
                    <div className="flex justify-center gap-6 text-sm font-bold text-ink/80 tracking-widest uppercase">
                        <span className="hover:text-vtg-primary cursor-pointer">Künye</span>
                        <span className="hover:text-vtg-primary cursor-pointer">Arşiv</span>
                        <span className="hover:text-vtg-primary cursor-pointer">İletişim</span>
                    </div>
                </footer>
            </div>
        </div>
    );
}

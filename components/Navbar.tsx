'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { useState } from 'react';

const NAV_LINKS = [
    { href: '/market', label: 'Nexus Haritası' },
    { href: '/gazette', label: 'Gazete' },
    { href: '/ilan', label: 'İlan Hanı' },
];

export default function Navbar() {
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <header className="sticky top-0 z-40 w-full border-b-2 border-nexus-primary/30 bg-nexus-bg/90 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 group cursor-pointer">
                        <Image
                            src="/nexus-logo.png"
                            alt="NEXUS Logo"
                            width={36}
                            height={36}
                            className="group-hover:animate-pulse"
                        />
                        <h1 className="font-pixel text-xl text-nexus-primary tracking-tighter drop-shadow-[0_0_5px_rgba(0,255,136,0.8)]">
                            NEXUS
                        </h1>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex gap-8 items-center">
                        {NAV_LINKS.map(link => {
                            const isActive = pathname === link.href;
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`font-terminal text-2xl transition-all ${isActive
                                        ? 'text-nexus-primary drop-shadow-[0_0_8px_rgba(0,255,136,1)]'
                                        : 'text-slate-300 hover:text-nexus-primary hover:drop-shadow-[0_0_8px_rgba(0,255,136,1)]'
                                        }`}
                                >
                                    {link.label}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="flex items-center gap-3">
                        {/* Wallet Button (decorative) */}
                        <button className="relative overflow-hidden bg-nexus-primary/10 border-2 border-nexus-primary text-nexus-primary px-4 py-2 rounded font-pixel text-[10px] uppercase tracking-wider hover:bg-nexus-primary hover:text-black hover:shadow-neon transition-all duration-300 group hidden sm:flex">
                            <span className="relative z-10 flex items-center gap-2">
                                <span className="material-symbols-outlined text-lg">account_balance_wallet</span>
                                BAĞLAN
                            </span>
                        </button>

                        {/* Mobile Hamburger */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden p-2 text-nexus-primary hover:bg-nexus-primary/10 rounded-lg transition-colors"
                            aria-label="Menu"
                        >
                            <span className="material-symbols-outlined text-2xl">
                                {mobileMenuOpen ? 'close' : 'menu'}
                            </span>
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden border-t border-nexus-primary/20 bg-nexus-bg/95 backdrop-blur-md">
                        <nav className="flex flex-col px-4 py-4 gap-1">
                            {NAV_LINKS.map(link => {
                                const isActive = pathname === link.href;
                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className={`font-terminal text-xl px-4 py-3 rounded-lg transition-all ${isActive
                                            ? 'text-nexus-primary bg-nexus-primary/10'
                                            : 'text-slate-300 hover:text-nexus-primary hover:bg-nexus-primary/5'
                                            }`}
                                    >
                                        {link.label}
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>
                )}
            </div>
        </header>
    );
}

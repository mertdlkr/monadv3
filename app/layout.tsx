import type { Metadata } from 'next';
import './globals.css';
import ClientLayout from '@/components/ClientLayout';

export const metadata: Metadata = {
    title: 'NEXUS — The First AI Economy',
    description: '50 yengeç AI agent dijital çarşıda otonom ticaret yapıyor. Canlı ekonomik simülasyon.',
    icons: { icon: '/nexus-logo.png' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="tr">
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Space+Grotesk:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&family=VT323&display=swap"
                    rel="stylesheet"
                />
                <link
                    href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
                    rel="stylesheet"
                />
            </head>
            <body className="font-inter min-h-screen flex flex-col">
                {/* Scanline Overlay */}
                <div className="fixed inset-0 z-50 scanline-overlay opacity-[0.15] pointer-events-none" />
                {/* Background Grid */}
                <div className="fixed inset-0 z-0 bg-grid pointer-events-none" />
                {/* Main Content with Simulation Provider */}
                <ClientLayout>{children}</ClientLayout>
            </body>
        </html>
    );
}

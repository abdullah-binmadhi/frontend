'use client';

import { Sidebar } from '@/components/layout/Sidebar';
import { TopBar } from '@/components/layout/TopBar';
import { MobileNav } from '@/components/layout/MobileNav';

export default function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen">
            {/* Desktop sidebar */}
            <div className="hidden lg:block">
                <Sidebar />
            </div>

            {/* Mobile nav */}
            <MobileNav />

            {/* Main content area */}
            <div className="flex flex-1 flex-col lg:pl-[240px]">
                <TopBar />
                <main className="flex-1 p-6">{children}</main>
            </div>
        </div>
    );
}

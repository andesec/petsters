import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';

interface MainContentProps {
    children: ReactNode;
}

export default function MainContent({ children, className }: { children: ReactNode; className?: string }) {
    const pathname = usePathname();

    // Map page should not scroll, other pages should
    const shouldScroll = pathname !== '/map';

    return (
        <div className={`bg-card/95 backdrop-blur-sm border border-border shadow-lg rounded-xl ${shouldScroll ? 'p-3 md:p-4 overflow-auto' : 'overflow-hidden'} h-full ${className || ''}`}>
            {children}
        </div>
    );
}

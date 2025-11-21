import { ReactNode } from 'react';

interface MainContentProps {
    children: ReactNode;
}

export default function MainContent({ children, className }: { children: ReactNode; className?: string }) {
    return (
        <div className={`bg-card/95 backdrop-blur-sm border border-border shadow-lg rounded-xl p-5 overflow-y-auto h-full ${className || ''}`}>
            {children}
        </div>
    );
}

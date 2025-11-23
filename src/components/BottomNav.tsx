'use client';

import { usePathname, useRouter } from 'next/navigation';

interface BottomNavProps {
    onOpenUpdates: () => void;
}

export default function BottomNav({ onOpenUpdates }: BottomNavProps) {
    const pathname = usePathname();
    const router = useRouter();

    const navItems = [
        { label: 'Map', icon: 'fa-map', path: '/map' },
        { label: 'Party', icon: 'fa-paw', path: '/party' }, // Placeholder path
        { label: 'Bag', icon: 'fa-briefcase', path: '/bag' }, // Placeholder path
        { label: 'Updates', icon: 'fa-bell', action: onOpenUpdates },
    ];

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-[100] bg-card/90 backdrop-blur-xl border-t border-border pb-safe">
            <div className="flex justify-around items-center h-16">
                {navItems.map((item) => {
                    const isActive = item.path === pathname;
                    return (
                        <button
                            key={item.label}
                            onClick={() => {
                                if (item.action) {
                                    item.action();
                                } else if (item.path) {
                                    router.push(item.path);
                                }
                            }}
                            className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors duration-200
                                ${isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                        >
                            <i className={`fas ${item.icon} text-lg mb-0.5 ${isActive ? 'animate-bounce-subtle' : ''}`}></i>
                            <span className="text-[10px] font-medium">{item.label}</span>
                            {isActive && (
                                <span className="absolute bottom-1 w-1 h-1 bg-primary rounded-full"></span>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

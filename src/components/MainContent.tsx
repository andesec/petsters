import { ReactNode } from 'react';

interface MainContentProps {
    children: ReactNode;
}

export default function MainContent({ children }: MainContentProps) {
    return (
        <div className="w-full md:w-[55%] bg-white border border-slate-400 shadow-md rounded-[10px] p-[15px] overflow-y-auto md:overflow-y-auto h-full">
            {children}
        </div>
    );
}

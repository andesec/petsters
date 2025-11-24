'use client';

import { useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from './AuthProvider';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        if (loading || isAuthenticated) return;

        const queryString = searchParams.toString();
        const currentPath = `${pathname}${queryString ? `?${queryString}` : ''}`;
        sessionStorage.setItem('postLoginRedirect', currentPath || '/');
        router.replace('/login');
    }, [isAuthenticated, loading, pathname, router, searchParams]);

    if (loading) {
        return (
            <div className="flex items-center justify-center p-8 text-sm text-muted-foreground">
                Checking authentication...
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    return <>{children}</>;
}

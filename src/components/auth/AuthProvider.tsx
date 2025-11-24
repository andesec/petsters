'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import AuthService, { AuthSession } from '@/services/AuthService';

interface AuthContextValue {
    user: AuthSession['user'] | null;
    isAuthenticated: boolean;
    loading: boolean;
    refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<AuthSession['user'] | null>(null);
    const [status, setStatus] = useState<'loading' | 'authenticated' | 'unauthenticated'>('loading');

    const refreshSession = useCallback(async () => {
        setStatus('loading');
        try {
            const session = await AuthService.getSession();
            setUser(session?.user ?? null);
            setStatus(session?.authenticated ? 'authenticated' : 'unauthenticated');
        } catch (error) {
            console.error('Failed to refresh auth session', error);
            setUser(null);
            setStatus('unauthenticated');
        }
    }, []);

    useEffect(() => {
        refreshSession();
    }, [refreshSession]);

    const value = useMemo(
        () => ({
            user,
            isAuthenticated: status === 'authenticated',
            loading: status === 'loading',
            refreshSession,
        }),
        [status, user, refreshSession]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

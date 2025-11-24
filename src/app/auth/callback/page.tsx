'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import AuthService from '@/services/AuthService';

export default function AuthCallbackPage() {
    const [error, setError] = useState('');
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const errorParam = searchParams.get('error');
        const code = searchParams.get('code');
        const state = searchParams.get('state') ?? undefined;

        if (errorParam) {
            setError(errorParam);
            return;
        }

        if (!code) {
            setError('Missing authorization code.');
            return;
        }

        const finishLogin = async () => {
            try {
                await AuthService.completeAuthorization(code, state);
                const redirectPath = sessionStorage.getItem('postLoginRedirect') || '/battle';
                sessionStorage.removeItem('postLoginRedirect');
                router.replace(redirectPath);
            } catch (e: unknown) {
                const message = e instanceof Error ? e.message : 'Unable to complete login.';
                setError(message);
            }
        };

        void finishLogin();
    }, [router, searchParams]);

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-full">
                <h1 className="text-2xl font-bold mb-4">Login Failed</h1>
                <p className="text-red-600">{error}</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center h-full">
            <h1 className="text-xl font-semibold">Signing you in...</h1>
            <p className="text-gray-600">Completing authorization flow. Please wait.</p>
        </div>
    );
}

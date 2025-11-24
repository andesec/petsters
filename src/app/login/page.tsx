'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthService, { AuthProvider } from '@/services/AuthService';
import config from '@/config';

const providers: { key: AuthProvider; label: string }[] = [
    { key: 'cognito', label: 'Login with Cognito' },
    { key: 'google', label: 'Continue with Google' },
    { key: 'discord', label: 'Continue with Discord' },
];

export default function LoginPage() {
    const [error, setError] = useState('');
    const router = useRouter();

    const startLogin = (provider: AuthProvider) => {
        if (config.disableLogin) {
            router.push('/battle');
            return;
        }

        try {
            AuthService.startLogin(provider, '/battle');
        } catch (e: unknown) {
            const message = e instanceof Error ? e.message : 'Unable to start login.';
            setError(message);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-full">
            <h1 className="text-2xl font-bold mb-4">Sign in to Petsters</h1>
            <div className="flex flex-col gap-3 w-[300px]">
                {providers.map((provider) => (
                    <button
                        key={provider.key}
                        type="button"
                        onClick={() => startLogin(provider.key)}
                        className="bg-[#3f51b5] text-white border-none px-4 py-2 rounded cursor-pointer hover:bg-[#303f9f]"
                    >
                        {provider.label}
                    </button>
                ))}
            </div>
            {error && <p className="text-red-500 mt-4">{error}</p>}
        </div>
    );
}

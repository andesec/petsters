'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthService from '@/services/AuthService';
import config from '@/config';

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const login = async (e: React.FormEvent) => {
        e.preventDefault();
        if (config.disableLogin) {
            router.push('/battle');
            return;
        }
        try {
            await AuthService.login(username, password);
            router.push('/battle');
        } catch (e: any) {
            setError(e.message);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-full">
            <h1 className="text-2xl font-bold mb-4">Login</h1>
            <form onSubmit={login} className="flex flex-col gap-4 w-[300px]">
                <input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                    required
                    className="border border-slate-400 rounded px-3 py-2"
                />
                <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    placeholder="Password"
                    required
                    className="border border-slate-400 rounded px-3 py-2"
                />
                <button
                    type="submit"
                    className="bg-[#3f51b5] text-white border-none px-4 py-2 rounded cursor-pointer hover:bg-[#303f9f]"
                >
                    Login
                </button>
            </form>
            {error && <p className="text-red-500 mt-4">{error}</p>}
        </div>
    );
}

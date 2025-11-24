'use client';

import Link from 'next/link';
import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import AuthService from '@/services/AuthService';
import config from '@/config';

export default function SignupPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSignup = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        if (config.disableLogin) {
            router.push('/battle');
            setLoading(false);
            return;
        }

        try {
            await AuthService.nativeSignup(email.trim(), password);
            setSuccess('Account created successfully. Redirecting to your adventure...');
            const redirectPath = sessionStorage.getItem('postLoginRedirect') || '/battle';
            sessionStorage.removeItem('postLoginRedirect');
            router.replace(redirectPath);
        } catch (e: unknown) {
            const message = e instanceof Error ? e.message : 'Unable to create your account.';
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-full gap-6">
            <h1 className="text-2xl font-bold">Create your Petsters account</h1>

            <form onSubmit={handleSignup} className="flex flex-col gap-3 w-[320px]">
                <label className="flex flex-col gap-1">
                    <span className="text-sm font-medium text-gray-700">Email</span>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="you@example.com"
                    />
                </label>

                <label className="flex flex-col gap-1">
                    <span className="text-sm font-medium text-gray-700">Password</span>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="At least 8 characters"
                    />
                </label>

                <button
                    type="submit"
                    disabled={loading}
                    className="bg-[#3f51b5] text-white border-none px-4 py-2 rounded cursor-pointer hover:bg-[#303f9f] disabled:opacity-60"
                >
                    {loading ? 'Creating account...' : 'Create account'}
                </button>

                <p className="text-sm text-gray-700 text-center">
                    Already have an account?{' '}
                    <Link href="/login" className="text-blue-600 hover:underline">
                        Sign in
                    </Link>
                </p>
            </form>

            {error && <p className="text-red-500 mt-2 text-center max-w-[320px]">{error}</p>}
            {success && <p className="text-green-600 mt-2 text-center max-w-[320px]">{success}</p>}
        </div>
    );
}

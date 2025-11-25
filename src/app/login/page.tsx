'use client';

import Link from 'next/link';
import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import AuthService, { AuthProvider } from '@/services/AuthService';
import config from '@/config';
import { authButton, authContainer, authForm, authHelperText, authInput, authLink } from '@/components/auth/styles';

const providers: { key: AuthProvider; label: string }[] = [
    { key: 'cognito', label: 'Login with Cognito' },
    { key: 'google', label: 'Continue with Google' },
    { key: 'discord', label: 'Continue with Discord' },
];

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
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

    const handleNativeLogin = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError('');
        setLoading(true);

        if (config.disableLogin) {
            router.push('/battle');
            setLoading(false);
            return;
        }

        try {
            await AuthService.nativeLogin(email.trim(), password);
            const redirectPath = sessionStorage.getItem('postLoginRedirect') || '/battle';
            sessionStorage.removeItem('postLoginRedirect');
            router.replace(redirectPath);
        } catch (e: unknown) {
            const message = e instanceof Error ? e.message : 'Unable to sign in.';
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={authContainer}>
            <h1 className="text-2xl font-bold">Sign in to Petsters</h1>

            <form onSubmit={handleNativeLogin} className={authForm}>
                <label className="flex flex-col gap-1">
                    <span className="text-sm font-medium text-gray-700">Email</span>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className={authInput}
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
                        className={authInput}
                        placeholder="••••••••"
                    />
                </label>

                <button type="submit" disabled={loading} className={authButton}>
                    {loading ? 'Signing in...' : 'Sign in'}
                </button>

                <p className={authHelperText}>
                    Don&apos;t have an account?{' '}
                    <Link href="/signup" className={authLink}>
                        Create one
                    </Link>
                </p>
            </form>

            <div className="flex flex-col gap-3 w-[320px]">
                <p className="text-sm font-medium text-gray-700 text-center">Or continue with</p>
                {providers.map((provider) => (
                    <button
                        key={provider.key}
                        type="button"
                        onClick={() => startLogin(provider.key)}
                        className={authButton}
                    >
                        {provider.label}
                    </button>
                ))}
            </div>

            {error && <p className="text-red-500 mt-2 text-center max-w-[320px]">{error}</p>}
        </div>
    );
}

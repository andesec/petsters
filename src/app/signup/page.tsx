'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import AuthService from '@/services/AuthService';
import config from '@/config';
import { authButton, authContainer, authForm, authHelperText, authInput, authLink } from '@/components/auth/styles';

export default function SignupPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [redirectCountdown, setRedirectCountdown] = useState(0);
    const router = useRouter();

    const emailPattern = useMemo(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/, []);

    useEffect(() => {
        if (!redirectCountdown) return;

        const timer = setTimeout(() => setRedirectCountdown((value) => value - 1), 1000);
        return () => clearTimeout(timer);
    }, [redirectCountdown]);

    useEffect(() => {
        if (redirectCountdown === 0 && success) {
            router.push('/login');
        }
    }, [redirectCountdown, router, success]);

    const validateForm = () => {
        const errors: Record<string, string> = {};
        const trimmedEmail = email.trim();

        if (!emailPattern.test(trimmedEmail)) {
            errors.email = 'Enter a valid email address.';
        }

        const passwordRequirements = [
            {
                test: (value: string) => value.length >= 8,
                message: 'At least 8 characters.',
            },
            {
                test: (value: string) => /[A-Z]/.test(value),
                message: 'One uppercase letter.',
            },
            {
                test: (value: string) => /[a-z]/.test(value),
                message: 'One lowercase letter.',
            },
            {
                test: (value: string) => /\d/.test(value),
                message: 'One number.',
            },
            {
                test: (value: string) => /[^A-Za-z0-9]/.test(value),
                message: 'One special character.',
            },
        ];

        const failedRequirements = passwordRequirements.filter((rule) => !rule.test(password));
        if (failedRequirements.length > 0) {
            errors.password = `Password needs: ${failedRequirements.map((rule) => rule.message).join(' ')}`;
        }

        if (password !== confirmPassword) {
            errors.confirmPassword = 'Passwords must match.';
        }

        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

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

        if (!validateForm()) {
            setLoading(false);
            return;
        }

        try {
            await AuthService.createCognitoNativeUser(email.trim(), password);
            setFieldErrors({});
            setSuccess(
                'Account created! Check your email to verify your address, then sign in to continue your adventure.'
            );
            setRedirectCountdown(5);
        } catch (e: unknown) {
            const message = e instanceof Error ? e.message : 'Unable to create your account.';
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={authContainer}>
            <h1 className="text-2xl font-bold">Create your Petsters account</h1>

            <form onSubmit={handleSignup} className={authForm} noValidate>
                <label className="flex flex-col gap-1">
                    <span className="text-sm font-medium text-gray-700">Email</span>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className={`${authInput} ${fieldErrors.email ? 'border-red-400 focus:ring-red-400' : ''}`}
                        placeholder="you@example.com"
                        aria-invalid={Boolean(fieldErrors.email)}
                        aria-describedby="email-error"
                    />
                    {fieldErrors.email && (
                        <span id="email-error" className="text-xs text-red-500">
                            {fieldErrors.email}
                        </span>
                    )}
                </label>

                <label className="flex flex-col gap-1">
                    <span className="text-sm font-medium text-gray-700">Password</span>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className={`${authInput} ${fieldErrors.password ? 'border-red-400 focus:ring-red-400' : ''}`}
                        placeholder="At least 8 characters, mixed case, number, special"
                        aria-invalid={Boolean(fieldErrors.password)}
                        aria-describedby="password-error"
                    />
                    {fieldErrors.password && (
                        <span id="password-error" className="text-xs text-red-500">
                            {fieldErrors.password}
                        </span>
                    )}
                </label>

                <label className="flex flex-col gap-1">
                    <span className="text-sm font-medium text-gray-700">Confirm password</span>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className={`${authInput} ${fieldErrors.confirmPassword ? 'border-red-400 focus:ring-red-400' : ''}`}
                        placeholder="Re-enter your password"
                        aria-invalid={Boolean(fieldErrors.confirmPassword)}
                        aria-describedby="confirm-password-error"
                    />
                    {fieldErrors.confirmPassword && (
                        <span id="confirm-password-error" className="text-xs text-red-500">
                            {fieldErrors.confirmPassword}
                        </span>
                    )}
                </label>

                <button type="submit" disabled={loading} className={authButton}>
                    {loading ? 'Creating account...' : 'Create account'}
                </button>

                <p className={authHelperText}>
                    Already have an account?{' '}
                    <Link href="/login" className={authLink}>
                        Sign in
                    </Link>
                </p>
            </form>

            {error && <p className="text-red-500 mt-2 text-center max-w-[320px]">{error}</p>}
            {success && (
                <div className="flex flex-col items-center gap-2 text-center max-w-[360px]">
                    <p className="text-green-600">{success}</p>
                    <p className="text-sm text-gray-700">
                        Redirecting to login {redirectCountdown > 0 && `in ${redirectCountdown}s`}.
                    </p>
                </div>
            )}
        </div>
    );
}

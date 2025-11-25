import config from '@/config';

export type AuthProvider = 'cognito' | 'google' | 'discord';
export type AuthSession = {
    authenticated: boolean;
    user?: Record<string, unknown> | null;
};

const getBffBaseUrl = () => config.bffBaseUrl ?? config.apiBaseUrl.replace(/\/api$/, '');

const buildLoginUrl = (provider: AuthProvider, redirectUri: string) => {
    const url = new URL('/auth/login', getBffBaseUrl());
    url.searchParams.set('provider', provider);
    url.searchParams.set('redirect_uri', redirectUri);
    return url.toString();
};

const parseErrorMessage = async (response: Response) => {
    try {
        const errorBody = await response.json();
        if (typeof errorBody?.message === 'string') {
            return errorBody.message;
        }

        if (typeof errorBody?.error === 'string') {
            return errorBody.error;
        }
    } catch {
        // ignore JSON parse errors and fall back to text
    }

    const fallback = await response.text();
    return fallback || 'Request failed.';
};

const AuthService = {
    startLogin(provider: AuthProvider = 'cognito', redirectPath = '/battle') {
        if (typeof window === 'undefined') return;

        const redirectUri = `${window.location.origin}/auth/callback`;
        sessionStorage.setItem('postLoginRedirect', redirectPath);
        window.location.assign(buildLoginUrl(provider, redirectUri));
    },

    async completeAuthorization(code: string, state?: string) {
        try {
            const response = await fetch(`${getBffBaseUrl()}/auth/callback`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ code, state }),
            });

            if (!response.ok) {
                const message = await parseErrorMessage(response);
                throw new Error(message || 'Failed to complete authorization.');
            }
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to complete authorization.';
            throw new Error(message);
        }
    },

    async logout() {
        const response = await fetch(`${getBffBaseUrl()}/auth/logout`, {
            method: 'POST',
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error('Failed to log out.');
        }
    },

    async nativeLogin(email: string, password: string) {
        const response = await fetch(`${getBffBaseUrl()}/auth/native/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            const message = await parseErrorMessage(response);
            throw new Error(message || 'Unable to complete login.');
        }
    },

    async createCognitoNativeUser(email: string, password: string) {
        const response = await fetch(`${getBffBaseUrl()}/auth/native/users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            const message = await parseErrorMessage(response);
            throw new Error(message || 'Unable to create account.');
        }
    },

    async nativeSignup(email: string, password: string) {
        return this.createCognitoNativeUser(email, password);
    },

    async getSession(): Promise<AuthSession> {
        const response = await fetch(`${getBffBaseUrl()}/auth/session`, {
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error('Unable to fetch session.');
        }

        try {
            return await response.json();
        } catch (error) {
            console.error('Failed to parse auth session response', error);
            throw new Error('Unable to fetch session.');
        }
    },
};

export default AuthService;

import config from '@/config';

export type AuthProvider = 'cognito' | 'google' | 'discord';

const getBffBaseUrl = () => config.bffBaseUrl ?? config.apiBaseUrl.replace(/\/api$/, '');

const buildLoginUrl = (provider: AuthProvider, redirectUri: string) => {
    const url = new URL('/auth/login', getBffBaseUrl());
    url.searchParams.set('provider', provider);
    url.searchParams.set('redirect_uri', redirectUri);
    return url.toString();
};

export default {
    startLogin(provider: AuthProvider = 'cognito', redirectPath = '/battle') {
        if (typeof window === 'undefined') return;

        const redirectUri = `${window.location.origin}/auth/callback`;
        sessionStorage.setItem('postLoginRedirect', redirectPath);
        window.location.assign(buildLoginUrl(provider, redirectUri));
    },

    async completeAuthorization(code: string, state?: string) {
        const response = await fetch(`${getBffBaseUrl()}/auth/callback`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ code, state }),
        });

        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(errorBody || 'Failed to complete authorization.');
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
};

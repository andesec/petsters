import config from '../config';

const getApiBaseUrl = () => {
    const base = config.bffBaseUrl ?? config.apiBaseUrl.replace(/\/api$/, '');
    return `${base.replace(/\/$/, '')}/api`;
};

const handleUnauthorized = () => {
    if (typeof window === 'undefined') return;

    const currentPath = `${window.location.pathname}${window.location.search}${window.location.hash}`;
    sessionStorage.setItem('postLoginRedirect', currentPath || '/');
    window.location.assign('/login');
};

class ApiService {
    baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    buildFetchConfig(method: string, body: any): RequestInit {
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };

        const fetchConfig: RequestInit = {
            method,
            headers,
            credentials: 'include',
        };

        if (body) {
            fetchConfig.body = JSON.stringify(body);
        }

        return fetchConfig;
    }

    async handleResponse(response: Response) {
        if (response.status === 401) {
            handleUnauthorized();
            throw new Error('Unauthorized. Redirecting to login.');
        }

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return await response.json();
    }

    async makeRequest(endpoint: string, method = 'GET', body: any = null) {
        const response = await fetch(`${this.baseUrl}${endpoint}`, this.buildFetchConfig(method, body));
        return this.handleResponse(response);
    }

    async makeRequestWithoutThrowingError(endpoint: string, method = 'GET', body: any = null) {
        try {
            const response = await fetch(`${this.baseUrl}${endpoint}`, this.buildFetchConfig(method, body));
            return await this.handleResponse(response);
        } catch (error) {
            if (error instanceof Error && error.message.startsWith('Unauthorized')) {
                return { error: error.message };
            }

            console.error('API Request failed', error);
            return { error: 'API Request failed' };
        }
    }
}

export default new ApiService(getApiBaseUrl());

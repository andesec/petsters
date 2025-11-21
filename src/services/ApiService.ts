import config from '../config';

class ApiService {
    baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    async makeRequest(endpoint: string, method = 'GET', body: any = null) {
        const token = typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null;
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const fetchConfig: RequestInit = { method, headers };
        if (body) {
            fetchConfig.body = JSON.stringify(body);
        }

        const response = await fetch(`${this.baseUrl}${endpoint}`, fetchConfig);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return await response.json();
    }

    async makeRequestWithoutThrowingError(endpoint: string, method = 'GET', body: any = null) {
        const token = typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null;
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const fetchConfig: RequestInit = { method, headers };
        if (body) {
            fetchConfig.body = JSON.stringify(body);
        }

        try {
            const response = await fetch(`${this.baseUrl}${endpoint}`, fetchConfig);
            return await response.json();
        } catch (error) {
            console.error('API Request failed', error);
            return { error: 'API Request failed' };
        }
    }
}

export default new ApiService(config.apiBaseUrl);

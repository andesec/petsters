import config from '../config';

class ApiService {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
    }

    async makeRequest(endpoint, method = 'GET', body = null) {
        const token = localStorage.getItem('token');
        const headers = {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        };

        const config = { method, headers };
        if (body) {
            config.body = JSON.stringify(body);
        }

        const response = await fetch(`${this.baseUrl}${endpoint}`, config);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return await response.json();
    }

    async makeRequestWithoutThrowingError(endpoint, method = 'GET', body = null) {
        const token = localStorage.getItem('token');
        const headers = {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        };

        const config = { method, headers };
        if (body) {
            config.body = JSON.stringify(body);
        }

        const response = await fetch(`${this.baseUrl}${endpoint}`, config);

        return await response.json();
    }

}

export default new ApiService(config.apiBaseUrl);
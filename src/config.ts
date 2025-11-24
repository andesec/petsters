const config = {
    apiBaseUrl: 'http://192.168.100.20:5001/api',
    // apiBaseUrl: 'http://127.0.0.1:5001/api',
    cognito: {
        region: 'us-east-1',
        userPoolId: 'us-east-1_XXXXXXX',
        clientId: 'XXXXXXXXXXXXX',
    },
    disableLogin: true,
};

export default config;

import config from '@/config';
import { CognitoUserPool, AuthenticationDetails, CognitoUser, ICognitoUserPoolData } from 'amazon-cognito-identity-js';

const poolData: ICognitoUserPoolData = {
    UserPoolId: config.cognito.userPoolId,
    ClientId: config.cognito.clientId,
};
const userPool = new CognitoUserPool(poolData);

export default {
    login(username: string, password: string): Promise<any> {
        const authenticationDetails = new AuthenticationDetails({ Username: username, Password: password });
        const user = new CognitoUser({ Username: username, Pool: userPool });

        return new Promise((resolve, reject) => {
            user.authenticateUser(authenticationDetails, {
                onSuccess: (result) => {
                    localStorage.setItem('token', result.getIdToken().getJwtToken());
                    resolve(result);
                },
                onFailure: reject,
            });
        });
    },

    logout() {
        localStorage.removeItem('token');
    },
};

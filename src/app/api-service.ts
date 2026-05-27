import { Injectable } from "@angular/core";
import { LoginService } from "./login-service";

export enum APIEndpoint {
    LOGIN = 'api/auth/login',
    REGIGSTER = 'api/auth/signup',
}

@Injectable()
export class APIservie {
    constructor(private loginService: LoginService) { }

    getAPIUrl(apiEndPoint: APIEndpoint) {
        const env = this.loginService.getEnv();
        let apiName = 'https://financegpt-backend-phm6.onrender.com/';
        if (env === 'dev') {
            apiName = 'http://localhost:5000/';
        }

        switch (apiEndPoint) {
            case APIEndpoint.LOGIN:
                return apiName + 'api/auth/login';
            case APIEndpoint.REGIGSTER:
                return apiName + 'api/auth/register';

            default:
                throw new Error('Unknown API endpoint');
        }

    }

}
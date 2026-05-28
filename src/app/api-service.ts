import { Injectable } from '@angular/core';
import { LoginService } from './login-service';

export enum APIEndpoint {
  LOGIN = 'api/auth/login',
  REGIGSTER = 'api/auth/signup',
  ADD_INCOME = 'api/auth/addIncome',
  GET_INCOME = 'api/auth/getIncome',
  DELETE_INCOME = 'api/auth/deleteIncome',
  ADD_EXPENSE = 'api/auth/addExpenses',
  GET_EXPENSE = 'api/auth/getExpenses',
  DELETE_EXPENSE = 'api/auth/deleteExpenses',
  ADD_GOAL = 'api/auth/addGoal',
  GET_GOAL = 'api/auth/getGoal',
  UPDATE_GOAL = 'api/auth/updateGoal',
  DELETE_GOAL = 'api/auth/deleteGoal',
}

@Injectable({ providedIn: 'root' })
export class APIservie {
  constructor(private loginService: LoginService) {}

  getAPIUrl(apiEndPoint: APIEndpoint) {
    const env = this.loginService.getEnv();
    let apiName = 'https://financegpt-backend-phm6.onrender.com/';
    if (env === 'dev') {
      apiName = 'http://localhost:5000/';
    }

    switch (apiEndPoint) {
      case APIEndpoint.LOGIN:
        return apiName + APIEndpoint.LOGIN;
      case APIEndpoint.REGIGSTER:
        return apiName + APIEndpoint.REGIGSTER;
      case APIEndpoint.ADD_INCOME:
        return apiName + APIEndpoint.ADD_INCOME;
      case APIEndpoint.GET_INCOME:
        return apiName + APIEndpoint.GET_INCOME;
      case APIEndpoint.DELETE_INCOME:
        return apiName + APIEndpoint.DELETE_INCOME;
      case APIEndpoint.ADD_EXPENSE:
        return apiName + APIEndpoint.ADD_EXPENSE;
      case APIEndpoint.GET_EXPENSE:
        return apiName + APIEndpoint.GET_EXPENSE;
      case APIEndpoint.DELETE_EXPENSE:
        return apiName + APIEndpoint.DELETE_EXPENSE;
      case APIEndpoint.ADD_GOAL:
        return apiName + APIEndpoint.ADD_GOAL;
      case APIEndpoint.GET_GOAL:
        return apiName + APIEndpoint.GET_GOAL;
      case APIEndpoint.UPDATE_GOAL:
        return apiName + APIEndpoint.UPDATE_GOAL;
      case APIEndpoint.DELETE_GOAL:
        return apiName + APIEndpoint.DELETE_GOAL;
      default:
        throw new Error('Unknown API endpoint');
    }
  }
}

import { NextFunction, Request, Response } from "express";
import { Container } from "instances-container";

import LoginUserUseCase from '../../../../Applications/use_case/LoginUserUseCase';
import RefreshAuthenticationUseCase from '../../../../Applications/use_case/RefreshAuthenticationUseCase';
import LogoutUserUseCase from '../../../../Applications/use_case/LogoutUserUseCase';

class AuthenticationsHandler {
  _container: Container;
  
  constructor(container: Container) {
    this._container = container;

    this.postAuthenticationHandler = this.postAuthenticationHandler.bind(this);
    this.putAuthenticationHandler = this.putAuthenticationHandler.bind(this);
    this.deleteAuthenticationHandler = this.deleteAuthenticationHandler.bind(this);
  }

  async postAuthenticationHandler(req: Request, res: Response, next: NextFunction) {
    try {
      const loginUserUseCase = this._container.getInstance(LoginUserUseCase.name);
      const { accessToken, refreshToken } = await loginUserUseCase.execute(req.body);
      return res.status(201).json({
        status: 'success',
        data: {
          accessToken,
          refreshToken,
        },
      });  
    } catch (error) {
      next(error);
    }
  }

  async putAuthenticationHandler(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshAuthenticationUseCase = this._container
        .getInstance(RefreshAuthenticationUseCase.name);
      const accessToken = await refreshAuthenticationUseCase.execute(req.body);

      return res.json({
        status: 'success',
        data: {
          accessToken,
        },
      });
    } catch (error) {
      console.log(error)
      next(error);
    }
  }

  async deleteAuthenticationHandler(req: Request, res: Response, next: NextFunction) {
    try {
      const logoutUserUseCase = this._container.getInstance(LogoutUserUseCase.name);
      await logoutUserUseCase.execute(req.body);
      return res.json({
        status: 'success',
      });
    } catch (error) {
      next(error) 
    }
  }
}

export default AuthenticationsHandler;

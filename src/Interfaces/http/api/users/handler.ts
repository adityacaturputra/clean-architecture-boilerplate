import { NextFunction, Request, Response } from "express";
import { Container } from "instances-container";

import AddUserUseCase from '../../../../Applications/use_case/AddUserUseCase';

class UsersHandler {
  _container: Container;

  constructor(container: Container) {
    this._container = container;

    this.postUserHandler = this.postUserHandler.bind(this);
  }

  async postUserHandler(req: Request, res: Response, next: NextFunction) {
    try {
      const addUserUseCase = this._container.getInstance(AddUserUseCase.name);
      const addedUser = await addUserUseCase.execute(req.body);
  
      return res.status(201).json({
        status: 'success',
        data: {
          addedUser,
        },
      });
    } catch (error) {
      next(error)
    }
  }
}

export default UsersHandler;

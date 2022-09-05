import { Express } from 'express';
import { Container } from 'instances-container';
import UsersHandler from './handler';
import routes from './routes';


class UsersApi {
  private _server: Express;
  private _container: Container;
  private _usersHandler: UsersHandler;
  
  constructor(server: Express, container: Container) {
    this._server = server;
    this._container = container;
    this._usersHandler = new UsersHandler(this._container);
  }

  register () {
    routes(this._server, this._usersHandler);
  }
}

export default UsersApi;

import { Express } from 'express';
import { Container } from 'instances-container';
import routes from './routes';
import AuthenticationsHandler from './handler';

class AuthenticationsApi {
  _server: Express;
  _container: Container;
  _usersHandler: AuthenticationsHandler;
  
  constructor(server: Express, container: Container) {
    this._server = server;
    this._container = container;
    this._usersHandler = new AuthenticationsHandler(this._container);
  }

  register () {
    routes(this._server, this._usersHandler);
  }
}

export default AuthenticationsApi;
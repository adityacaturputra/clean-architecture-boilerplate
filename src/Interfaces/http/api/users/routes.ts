import UsersHandler from './handler';
import { Express } from 'express';

const routes = (server: Express, handler: UsersHandler) => {
  server.post('/users', handler.postUserHandler)
}

export default routes;

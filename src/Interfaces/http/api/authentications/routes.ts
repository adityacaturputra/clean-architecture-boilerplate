import UsersHandler from './handler';
import { Express } from 'express';

const routes = (server: Express, handler: UsersHandler) => {
  server.post('/authentications', handler.postAuthenticationHandler)
  server.put('/authentications', handler.putAuthenticationHandler)
  server.delete('/authentications', handler.deleteAuthenticationHandler)
}

export default routes;

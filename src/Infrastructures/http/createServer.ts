import express, { Express, NextFunction, Request, Response } from 'express'
import dotenv from 'dotenv'
import { Container } from 'instances-container'
import ClientError from '../../Commons/exceptions/ClientError'
import DomainErrorTranslator from '../../Commons/exceptions/DomainErrorTranslator'
import UsersApi from '../../Interfaces/http/api/users'
import AuthenticationsApi from '../../Interfaces/http/api/authentications'

const createServer = (container: Container) : Express => {
  dotenv.config()

  const server = express()
  server.use(express.json())
  const usersApi = new UsersApi(server, container)
  const authenticationsApi = new AuthenticationsApi(server, container)

  usersApi.register()
  authenticationsApi.register()

  server.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    // bila response tersebut error, tangani sesuai kebutuhan
    const translatedError = DomainErrorTranslator.translate(err);

    // penanganan client error secara internal.
    if (translatedError instanceof ClientError) {
      return res.status(translatedError.statusCode).json({
        status: 'fail',
        message: translatedError.message,
      });
    }

    // penanganan server error sesuai kebutuhan
    return res.status(500).json({
      status: 'error',
      message: 'terjadi kegagalan pada server kami',
    })
  })

  return server
};

export default createServer

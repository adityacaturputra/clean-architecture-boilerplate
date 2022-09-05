import pool from '../../database/postgres/pool';
import UsersTableTestHelper from '../../../../tests/UsersTableTestHelper';
import AuthenticationsTableTestHelper from '../../../../tests/AuthenticationsTableTestHelper';
import container from '../../container';
import createServer from '../createServer';
import AuthenticationTokenManager from '../../../Applications/security/AuthenticationTokenManager';
import request from 'supertest';

describe('/authentications endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
  });

  describe('when POST /authentications', () => {
    it('should response 201 and new authentication', async () => {
      // Arrange
      const requestPayload = {
        username: 'dicoding',
        password: 'secret',
      };
      const server = createServer(container);
      // add user
      await request(server).post('/users').send({...requestPayload, fullname: 'Dicoding Indonesia'})

      // Action
      const response = await request(server).post('/authentications').send(requestPayload)

      // Assert
      const responseBody = response.body;
      expect(response.status).toEqual(201);
      expect(responseBody.status).toEqual('success');
      expect(responseBody.data.accessToken).toBeDefined();
      expect(responseBody.data.refreshToken).toBeDefined();
    });

    it('should response 400 if username not found', async () => {
      // Arrange
      const requestPayload = {
        username: 'dicoding',
        password: 'secret',
      };
      const server = createServer(container);

      // Action
      const response = await request(server).post('/authentications').send(requestPayload); 
      
      // server.inject({
      //   method: 'POST',
      //   url: '/authentications',
      //   payload: requestPayload,
      // });

      // Assert
      const responseBody = response.body;
      expect(response.status).toEqual(400);
      expect(responseBody.status).toEqual('fail');
      expect(responseBody.message).toEqual('username tidak ditemukan');
    });

    it('should response 401 if password wrong', async () => {
      // Arrange
      const requestPayload = {
        username: 'dicoding',
        password: 'wrong_password',
      };
      const server = createServer(container);
      // Add user
      await request(server).post('/users').send({
            username: 'dicoding',
            password: 'secret',
            fullname: 'Dicoding Indonesia',
      })
      // await server.inject({
      //   method: 'POST',
      //   url: '/users',
      //   payload: {
      //     username: 'dicoding',
      //     password: 'secret',
      //     fullname: 'Dicoding Indonesia',
      //   },
      // });

      // Action
      const response = await request(server).post('/authentications').send(requestPayload);
      
      // server.inject({
      //   method: 'POST',
      //   url: '/authentications',
      //   payload: requestPayload,
      // });

      // Assert
      const responseBody = response.body;
      expect(response.status).toEqual(401);
      expect(responseBody.status).toEqual('fail');
      expect(responseBody.message).toEqual('kredensial yang Anda masukkan salah');
    });

    it('should response 400 if login payload not contain needed property', async () => {
      // Arrange
      const requestPayload = {
        username: 'dicoding',
      };
      const server = createServer(container);

      // Action
      const response = await request(server).post('/authentications').send(requestPayload)
      
      // server.inject({
      //   method: 'POST',
      //   url: '/authentications',
      //   payload: requestPayload,
      // });

      // Assert
      const responseBody = response.body;
      expect(response.status).toEqual(400);
      expect(responseBody.status).toEqual('fail');
      expect(responseBody.message).toEqual('harus mengirimkan username dan password');
    });

    it('should response 400 if login payload wrong data type', async () => {
      // Arrange
      const requestPayload = {
        username: 123,
        password: 'secret',
      };
      const server = createServer(container);

      // Action
      const response = await request(server).post('/authentications').send(requestPayload)
      // server.inject({
      //   method: 'POST',
      //   url: '/authentications',
      //   payload: requestPayload,
      // });

      // Assert
      const responseBody = response.body;
      expect(response.status).toEqual(400);
      expect(responseBody.status).toEqual('fail');
      expect(responseBody.message).toEqual('username dan password harus string');
    });
  });

  describe('when PUT /authentications', () => {
    it('should return 200 and new access token', async () => {
      // Arrange
      const server = createServer(container);
      // add user
      
      await request(server).post('/users').send({
        username: 'dicoding',
        password: 'secret',
        fullname: 'Dicoding Indonesia',
      }) 
      // server.inject({
      //   method: 'POST',
      //   url: '/users',
      //   payload: {
      //     username: 'dicoding',
      //     password: 'secret',
      //     fullname: 'Dicoding Indonesia',
      //   },
      // });

      // login user
      const loginResponse = await request(server).post('/authentications').send({
        username: 'dicoding',
        password: 'secret',
      })
      // server.inject({
      //   method: 'POST',
      //   url: '/authentications',
      //   payload: {
      //     username: 'dicoding',
      //     password: 'secret',
      //   },
      // });

      const { data: { refreshToken } } = loginResponse.body;

      // Action
      const response = await request(server).put('/authentications').send({refreshToken})
      // server.inject({
      //   method: 'PUT',
      //   url: '/authentications',
      //   payload: {
      //     refreshToken,
      //   },
      // });

      const responseBody = response.body;
      expect(response.status).toEqual(200);
      expect(responseBody.status).toEqual('success');
      expect(responseBody.data.accessToken).toBeDefined();
    });

    it('should return 400 payload not contain refresh token', async () => {
      // Arrange
      const server = createServer(container);

      // Action
      const response = await request(server).put('/authentications').send({}) 
      // server.inject({
      //   method: 'PUT',
      //   url: '/authentications',
      //   payload: {},
      // });

      const responseBody = response.body;
      expect(response.status).toEqual(400);
      expect(responseBody.status).toEqual('fail');
      expect(responseBody.message).toEqual('harus mengirimkan token refresh');
    });

    it('should return 400 if refresh token not string', async () => {
      // Arrange
      const server = createServer(container);

      // Action
      const response = await request(server).put('/authentications').send({refreshToken: 123}) 
      // server.inject({
      //   method: 'PUT',
      //   url: '/authentications',
      //   payload: {
      //     refreshToken: 123,
      //   },
      // });

      const responseBody = response.body;
      expect(response.status).toEqual(400);
      expect(responseBody.status).toEqual('fail');
      expect(responseBody.message).toEqual('refresh token harus string');
    });

    it('should return 400 if refresh token not valid', async () => {
      // Arrange
      const server = createServer(container);

      // Action
      const response = await request(server).put('/authentications').send({refreshToken: 'invalid_refresh_token'}) 
      // server.inject({
      //   method: 'PUT',
      //   url: '/authentications',
      //   payload: {
      //     refreshToken: 'invalid_refresh_token',
      //   },
      // });

      // Assert
      const responseBody = response.body;
      expect(response.status).toEqual(400);
      expect(responseBody.status).toEqual('fail');
      expect(responseBody.message).toEqual('refresh token tidak valid');
    });

    it('should return 400 if refresh token not registered in database', async () => {
      // Arrange
      const server = createServer(container);
      const refreshToken = await container.getInstance(AuthenticationTokenManager.name).createRefreshToken({ username: 'dicoding' });

      // Action
      const response = await request(server).put('/authentications').send({refreshToken}) 
      // server.inject({
      //   method: 'PUT',
      //   url: '/authentications',
      //   payload: {
      //     refreshToken,
      //   },
      // });

      // Assert
      const responseBody = response.body;
      expect(response.status).toEqual(400);
      expect(responseBody.status).toEqual('fail');
      expect(responseBody.message).toEqual('refresh token tidak ditemukan di database');
    });
  });

  describe('when DELETE /authentications', () => {
    it('should response 200 if refresh token valid', async () => {
      // Arrange
      const server = createServer(container);
      const refreshToken = 'refresh_token';
      await AuthenticationsTableTestHelper.addToken(refreshToken);

      // Action
      const response = await request(server).delete('/authentications').send({refreshToken})
      // server.inject({
      //   method: 'DELETE',
      //   url: '/authentications',
      //   payload: {
      //     refreshToken,
      //   },
      // });

      // Assert
      const responseBody = response.body;
      expect(response.status).toEqual(200);
      expect(responseBody.status).toEqual('success');
    });

    it('should response 400 if refresh token not registered in database', async () => {
      // Arrange
      const server = createServer(container);
      const refreshToken = 'refresh_token';

      // Action
      const response = await request(server).delete('/authentications').send({refreshToken})
      // server.inject({
      //   method: 'DELETE',
      //   url: '/authentications',
      //   payload: {
      //     refreshToken,
      //   },
      // });

      // Assert
      const responseBody = response.body;
      expect(response.status).toEqual(400);
      expect(responseBody.status).toEqual('fail');
      expect(responseBody.message).toEqual('refresh token tidak ditemukan di database');
    });

    it('should response 400 if payload not contain refresh token', async () => {
      // Arrange
      const server = createServer(container);

      // Action
      const response = await request(server).delete('/authentications').send({})
      // server.inject({
      //   method: 'DELETE',
      //   url: '/authentications',
      //   payload: {},
      // });

      const responseBody = response.body;
      expect(response.status).toEqual(400);
      expect(responseBody.status).toEqual('fail');
      expect(responseBody.message).toEqual('harus mengirimkan token refresh');
    });

    it('should response 400 if refresh token not string', async () => {
      // Arrange
      const server = createServer(container);

      // Action
      const response = await request(server).delete('/authentications').send({refreshToken: 123})
      // server.inject({
      //   method: 'DELETE',
      //   url: '/authentications',
      //   payload: {
      //     refreshToken: 123,
      //   },
      // });

      const responseBody = response.body;
      expect(response.status).toEqual(400);
      expect(responseBody.status).toEqual('fail');
      expect(responseBody.message).toEqual('refresh token harus string');
    });
  });
});

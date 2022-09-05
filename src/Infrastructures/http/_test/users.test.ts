import request from 'supertest'
import pool from '../../database/postgres/pool';
import UsersTableTestHelper from '../../../../tests/UsersTableTestHelper';
import container from '../../container';
import createServer from '../createServer';

describe('/users endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
  });

  describe('when POST /users', () => {
    it('should response 201 and persisted user', async () => {
      // Arrange
      const requestPayload = {
        username: 'dicoding',
        password: 'secret',
        fullname: 'Dicoding Indonesia',
      };
      // eslint-disable-next-line no-undef
      const server = createServer(container);

      // Action
      const response = await request(server).post('/users').send(requestPayload);
      // server.inject({
      //   method: 'POST',
      //   url: '/users',
      //   payload: requestPayload,
      // });

      // Assert
      const responseBody = response.body;
      expect(response.status).toEqual(201);
      expect(responseBody.status).toEqual('success');
      expect(responseBody.data.addedUser).toBeDefined();
    });

    it('should response 400 when request payload not contain needed property', async () => {
      // Arrange
      const requestPayload = {
        fullname: 'Dicoding Indonesia',
        password: 'secret',
      };
      const server = createServer(container);

      // Action
      const response = await request(server).post('/users').send(requestPayload)
      // server.inject({
      //   method: 'POST',
      //   url: '/users',
      //   payload: requestPayload,
      // });

      // Assert
      const responseBody = response.body;
      expect(response.status).toEqual(400);
      expect(responseBody.status).toEqual('fail');
      expect(responseBody.message).toEqual('tidak dapat membuat user baru karena properti yang dibutuhkan tidak ada');
    });

    it('should response 400 when request payload not meet data type specification', async () => {
      // Arrange
      const requestPayload = {
        username: 'dicoding',
        password: 'secret',
        fullname: ['Dicoding Indonesia'],
      };
      const server = createServer(container);

      // Action
      const response = await request(server).post('/users').send(requestPayload) 
      // server.inject({
      //   method: 'POST',
      //   url: '/users',
      //   payload: requestPayload,
      // });

      // Assert
      const responseBody = response.body;
      expect(response.status).toEqual(400);
      expect(responseBody.status).toEqual('fail');
      expect(responseBody.message).toEqual('tidak dapat membuat user baru karena tipe data tidak sesuai');
    });

    it('should response 400 when username more than 50 character', async () => {
      // Arrange
      const requestPayload = {
        username: 'dicodingindonesiadicodingindonesiadicodingindonesiadicoding',
        password: 'secret',
        fullname: 'Dicoding Indonesia',
      };
      const server = createServer(container);

      // Action
      const response = await request(server).post('/users').send(requestPayload)
      // server.inject({
      //   method: 'POST',
      //   url: '/users',
      //   payload: requestPayload,
      // });

      // Assert
      const responseBody = response.body;
      expect(response.status).toEqual(400);
      expect(responseBody.status).toEqual('fail');
      expect(responseBody.message).toEqual('tidak dapat membuat user baru karena karakter username melebihi batas limit');
    });

    it('should response 400 when username contain restricted character', async () => {
      // Arrange
      const requestPayload = {
        username: 'dicoding indonesia',
        password: 'secret',
        fullname: 'Dicoding Indonesia',
      };
      const server = createServer(container);

      // Action
      const response = await request(server).post('/users').send(requestPayload) 
      // server.inject({
      //   method: 'POST',
      //   url: '/users',
      //   payload: requestPayload,
      // });

      // Assert
      const responseBody = response.body;
      expect(response.status).toEqual(400);
      expect(responseBody.status).toEqual('fail');
      expect(responseBody.message).toEqual('tidak dapat membuat user baru karena username mengandung karakter terlarang');
    });

    it('should response 400 when username unavailable', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ username: 'dicoding' });
      const requestPayload = {
        username: 'dicoding',
        fullname: 'Dicoding Indonesia',
        password: 'super_secret',
      };
      const server = createServer(container);

      // Action
      const response = await request(server).post('/users').send(requestPayload);
      // server.inject({
      //   method: 'POST',
      //   url: '/users',
      //   payload: requestPayload,
      // });

      // Assert
      const responseBody = response.body;
      expect(response.status).toEqual(400);
      expect(responseBody.status).toEqual('fail');
      expect(responseBody.message).toEqual('username tidak tersedia');
    });
  });
});

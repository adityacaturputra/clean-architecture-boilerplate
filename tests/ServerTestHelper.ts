/* istanbul ignore file */

import createServer from '../src/Infrastructures/http/createServer';
import container from '../src/Infrastructures/container';
import request from 'supertest';

const ServerTestHelper = {
  async getAccessToken() {
    const userPayload = {
      username: 'user',
      password: 'password',
      fullname: 'User',
    };
    const loginPayload = {
      username: 'user',
      password: 'password',
    };

    const server = createServer(container);
    await request(server).post('/users').send(userPayload)
    

    const response = await request(server).post('/authentications').send(loginPayload)


    if (response.status !== 201) {
      throw new Error('Gagal melakukan authentikasi');
    }

    return response.body.data.accessToken;
  },
};

export default ServerTestHelper;

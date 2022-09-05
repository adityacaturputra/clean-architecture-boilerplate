import request from 'supertest'
import createServer from '../createServer';
import ServerTestHelper from '../../../../tests/ServerTestHelper';
import container from '../../container';
import { Container, createContainer } from 'instances-container';


describe('HTTP server', () => {
  it('should response 404 when request unregistered route', async () => {
    // Arrange
    const server = createServer(container);

    // Action
    const response = await request(server).get('/unregisteredRoute') 
    
    // server.inject({
    //   method: 'GET',
    //   url: '/unregisteredRoute',
    // });

    // Assert
    expect(response.status).toEqual(404);
  });

  it('should handle server error correctly', async () => {
    // Arrange
    const requestPayload = {
      username: 'dicoding',
      fullname: 'Dicoding Indonesia',
      password: 'super_secret',
    };

    const fakeContainer: Container = createContainer();
    const server = createServer(fakeContainer); // fake injection

    // Action
    const response = await request(server).post('/users').send(requestPayload)
    // server.inject({
    //   method: 'POST',
    //   url: '/users',
    //   payload: requestPayload,
    // });

    // Assert
    const responseBody = response.body;
    expect(response.status).toEqual(500);
    expect(responseBody.status).toEqual('error');
    expect(responseBody.message).toEqual('terjadi kegagalan pada server kami');
  });

  // it('should response 401 when no credentials', async () => {
  //   // Arrange
  //   const server = createServer(container);

  //   // Action
  //   const response = await request(server).get('/tests/jwt')
  //   // server.inject({
  //   //   method: 'GET',
  //   //   url: '/tests/jwt',
  //   // });

  //   // Assert
  //   expect(response.status).toEqual(401);
  // });

  // it('should handle jwt correctly', async () => {
  //   // Arrange
  //   const accessToken = await ServerTestHelper.getAccessToken();
  //   const server = createServer(container);

  //   // Action
  //   const response = await request(server).get('/tests/jwt').set({Authorization: `Bearer ${accessToken}`})
    
  //   // server.inject({
  //   //   method: 'GET',
  //   //   url: '/tests/jwt',
  //   //   headers: {
  //   //     Authorization: `Bearer ${accessToken}`,
  //   //   },
  //   // });

  //   // Assert
  //   expect(accessToken).toBeDefined();
  //   const responseBody = response.body;
  //   expect(responseBody.credentialId).toBeDefined();
  // });

  // describe('when GET /', () => {
  //   it('should return 200 and hello world', async () => {
  //     // Arrange
  //     const server = createServer(container);
  //     // Action
  //     const response = await request(server).get('/`')
  //     // server.inject({
  //     //   method: 'GET',
  //     //   url: '/',
  //     // });
  //     // Assert
  //     const responseBody = response.body;
  //     expect(response.status).toEqual(200);
  //     expect(responseBody.value).toEqual('Hello world!');
  //   });
  // });
});

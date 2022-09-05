require('dotenv').config();
import createServer from './Infrastructures/http/createServer';
import container from './Infrastructures/container';

(async () => {
  const server = createServer(container);
  server.listen();
})();

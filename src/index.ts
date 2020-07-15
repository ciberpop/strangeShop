import * as http from 'http';

import {app} from './app';
import {config} from './config';

const server = http.createServer(app);

server.listen(config.PORT, () => {
  console.log(`Server is running on port ${config.PORT}...`);
});

process.on('SIGTERM', () => {
  server.close(() => {
    process.exit(0);
  });
});

process.on('uncaughtException', error => {
  console.log(error);
});

process.on('unhandledRejection', error => {
  console.log(error);
});

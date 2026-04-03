import 'module-alias/register';
import fs from 'fs';
import dbConnection from '../infra/db/mongodb/helpers/db-connection';
import env from './config/env';
import setupApp from './config/app';
import { ok } from 'assert';
import path from 'path';
import 'dotenv/config'
import http from 'http';
import https from 'https';

dbConnection.connect(env.mongodbUrl)
  .then(async () => {
    await dbConnection.connect(env.mongodbUrl);
    await dbConnection.migration();

    const app = setupApp();
    app.set('trust proxy', true); 

    if (process.env.NODE_ENV === 'development') {
      const httpsOptions = {
        key: fs.readFileSync(path.resolve(__dirname, '../../certs/key.pem')),
        cert: fs.readFileSync(path.resolve(__dirname, '../../certs/cert.pem')),
      };

      https.createServer(httpsOptions, app).listen(env.port, () => {
        console.log(`Development HTTPS server running on https://localhost:${env.port}`);
      });
    } else {
      http.createServer(app).listen(env.port, () => {
        console.log(` Production HTTP server running on port ${env.port}`);
        console.log(` proxied rawr `);
      });
    }
  })
  .catch(console.error);
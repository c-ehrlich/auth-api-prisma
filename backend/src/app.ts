require('dotenv').config();
import express from 'express';
import config from 'config';
import connectToDb from './utils/connectToDb';
import log from './utils/logger';

import router from './routes';
import deserializeUser from './middleware/deserializeUser';

const app = express();

// in the past we would have used body-parser for this
app.use(express.json());

app.use(deserializeUser);

// router needs to be below any 'use' statements that are used inthe routes
app.use(router);

const port = config.get('port');
app.listen(port, () => {
  log.info(`App started at http://localhost:${port}`);
  connectToDb();
});

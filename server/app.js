/*  eslint import/no-cycle: [2, { maxDepth: 1 }]  */
import express from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';
import routes from './server/routes';

// Set up the express app
const app = express();

// Log requests to the console.
app.use(logger('dev'));

app.set('superSecret', process.env.SUPER_SECRET); // secret variable

// To display images stored
app.use('/usersUploads', express.static('usersUploads'));
app.use('/questionsUploads', express.static('questionsUploads'));
app.use('/answersUploads', express.static('answersUploads'));

app.use('/docs', express.static('apiary.apib')); // access to documents

// Parse incoming requests data (https://github.com/expressjs/body-parser)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Require our routes into the application.
routes(app);

// Setup a default catch-all route that sends back a welcome message in JSON format.
app.get('*', (req, res) => res.status(200).send({
  message: 'Welcome to the beginning of nothingness.',
}));

export default app;

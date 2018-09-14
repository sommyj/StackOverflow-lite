/*  eslint import/no-cycle: [2, { maxDepth: 1 }]  */
import controllers from '../controllers';

const [usersController] = [controllers.usersController];
const [questionsController] = [controllers.questionsController];
const [answersController] = [controllers.answersController];

const routes = (app) => {
  app.all('/*', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers',
      'X-Requested-With, Content-Type, X-Access-Token, Authorization');
    res.header('Access-Control-Allow-Methods',
      'POST, GET, PUT, DELETE');
    next();
  });

  app.get('/api', (req, res) => res.status(200).send({
    message: 'Welcome to the User API!'
  }));

  app.post('/auth/v1/signup', usersController.upload, usersController.create);
  app.post('/auth/v1/login', usersController.check);

  app.post('/v1/questions', questionsController.upload, questionsController.create);
  app.get('/v1/questions', questionsController.list);
  app.get('/v1/questions/:questionId', questionsController.retrieve);
  app.delete('/v1/questions/:questionId', questionsController.destroy);

  app.post('/v1/questions/:questionId/answers', answersController.upload, answersController.create);
  app.put('/v1/questions/:questionId/answers/:answerId', answersController.upload, answersController.update);
};

export default routes;

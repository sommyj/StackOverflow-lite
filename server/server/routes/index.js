/*  eslint import/no-cycle: [2, { maxDepth: 1 }]  */
import controllers from '../controllers';

const [usersController] = [controllers.usersController];
const [questionsController] = [controllers.questionsController];

const routes = (app) => {
  app.get('/api', (req, res) => res.status(200).send({
    message: 'Welcome to the User API!'
  }));

  app.post('/auth/v1/signup', usersController.upload, usersController.create);
  app.post('/auth/v1/login', usersController.check);

  app.post('/v1/questions', questionsController.upload, questionsController.create);
};

export default routes;

/*  eslint import/no-cycle: [2, { maxDepth: 1 }]  */
import usersController from '../controllers/index';

const routes = (app) => {
  app.get('/api', (req, res) => res.status(200).send({
    message: 'Welcome to the User API!'
  }));

  app.post('/auth/v1/signup', usersController.upload, usersController.create);
  app.post('/auth/v1/login', usersController.check);
};

export default routes;

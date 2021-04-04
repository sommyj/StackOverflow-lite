'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _controllers = require('../controllers');

var _controllers2 = _interopRequireDefault(_controllers);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _ref = [_controllers2.default.usersController],
    usersController = _ref[0]; /*  eslint import/no-cycle: [2, { maxDepth: 1 }]  */

var _ref2 = [_controllers2.default.questionsController],
    questionsController = _ref2[0];
var _ref3 = [_controllers2.default.answersController],
    answersController = _ref3[0];


var routes = function routes(app) {
  app.all('/*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, X-Access-Token');

    // Auth Each API Request created by user.
    next();
  });

  app.get('/api', function (req, res) {
    return res.status(200).send({
      message: 'Welcome to the User API!'
    });
  });

  app.post('/auth/v1/signup', usersController.upload, usersController.create);
  app.post('/auth/v1/login', usersController.check);

  app.post('/v1/questions', questionsController.upload, questionsController.create);
  app.get('/v1/questions', questionsController.list);
  app.get('/v1/questions/:questionId', questionsController.retrieve);
  app.delete('/v1/questions/:questionId', questionsController.destroy);

  app.post('/v1/questions/:questionId/answers', answersController.upload, answersController.create);
  app.put('/v1/questions/:questionId/answers/:answerId', answersController.upload, answersController.update);
};

exports.default = routes;
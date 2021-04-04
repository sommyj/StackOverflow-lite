'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _users = require('./users');

var _users2 = _interopRequireDefault(_users);

var _questions = require('./questions');

var _questions2 = _interopRequireDefault(_questions);

var _answers = require('./answers');

var _answers2 = _interopRequireDefault(_answers);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var controllers = { usersController: _users2.default, questionsController: _questions2.default, answersController: _answers2.default }; /*  eslint import/no-cycle: [2, { maxDepth: 1 }]  */
exports.default = controllers;
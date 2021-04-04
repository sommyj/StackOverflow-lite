'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _user = require('./user');

var _user2 = _interopRequireDefault(_user);

var _question = require('./question');

var _question2 = _interopRequireDefault(_question);

var _answer = require('./answer');

var _answer2 = _interopRequireDefault(_answer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var models = { User: _user2.default, Question: _question2.default, Answer: _answer2.default };

exports.default = models;
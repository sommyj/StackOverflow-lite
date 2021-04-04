'use strict';

var _dbConnection = require('./dbConnection');

var _dbConnection2 = _interopRequireDefault(_dbConnection);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _ref = [_dbConnection2.default.client],
    client = _ref[0]; /* eslint-disable no-console */

client.connect(function (err) {
  if (err) {
    console.error('connection error', err.stack);
  } else {
    console.log('connected');
  }
});

/*
 * Deletion of User, Question, Answers and Comments Table
 */
client.query('DROP TABLE users, questions, answers, comments').then(function (result) {
  if (result.command === 'DROP') console.log('Tables are dropped');
}).catch(function (e) {
  return console.error(e.stack);
}).then(function () {
  return client.end();
});
/* eslint-enable no-console */
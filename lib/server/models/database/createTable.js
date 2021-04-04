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
 * User, Question, Answers and Comments Table creation
 */
client.query('CREATE TABLE users(id SERIAL PRIMARY KEY, title CHAR(10), firstname VARCHAR(50),\n   lastname VARCHAR(50), username VARCHAR(50) UNIQUE NOT NULL, password VARCHAR(200) NOT NULL,\n   email VARCHAR(50) UNIQUE NOT NULL, gender VARCHAR(6), country VARCHAR(30) NOT NULL,\n   phone VARCHAR(15) UNIQUE, userImage VARCHAR(200), createdAt DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,\n   updatedAt DATE NOT NULL DEFAULT CURRENT_TIMESTAMP)').then(function (result1) {
  if (result1.command === 'CREATE') console.log('users table created');

  client.query('CREATE TABLE questions(id SERIAL PRIMARY KEY, title VARCHAR(100) UNIQUE NOT NULL,\n       question TEXT NOT NULL, userId INTEGER REFERENCES users(id) ON DELETE CASCADE,tags VARCHAR(50),\n       questionImage VARCHAR(200), createdAt DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,\n       updatedAt DATE NOT NULL DEFAULT CURRENT_TIMESTAMP)').then(function (result2) {
    if (result2.command === 'CREATE') console.log('questions table created');

    client.query('CREATE TABLE answers(id SERIAL PRIMARY KEY, response TEXT NOT NULL, userId INTEGER REFERENCES users(id) ON DELETE CASCADE,\n           questionId INTEGER REFERENCES questions(id) ON DELETE CASCADE, accepted BOOLEAN DEFAULT false,\n           vote INTEGER NOT NULL DEFAULT 0, answerImage VARCHAR(200), createdAt DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,\n           updatedAt DATE NOT NULL DEFAULT CURRENT_TIMESTAMP)').then(function (result3) {
      if (result3.command === 'CREATE') console.log('answers table created');

      client.query('CREATE TABLE comments(id SERIAL PRIMARY KEY,response TEXT NOT NULL, userId INTEGER REFERENCES users(id),\n               answersId INTEGER REFERENCES answers(id), createdAt DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,\n               updatedAt DATE NOT NULL DEFAULT CURRENT_TIMESTAMP)').then(function (result4) {
        if (result4.command === 'CREATE') console.log('comments table created');
      }).catch(function (e) {
        return console.error(e.stack);
      }).then(function () {
        return client.end();
      });
    }).catch(function (e) {
      console.error(e.stack);
      client.end();
    });
  }).catch(function (e) {
    console.error(e.stack);
    client.end();
  });
}).catch(function (e) {
  console.error(e.stack);
  client.end();
});
/* eslint-enable no-console */
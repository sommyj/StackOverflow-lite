'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _query = require('./database/query');

var _query2 = _interopRequireDefault(_query);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Question = {
  create: function create(data) {
    // SQL Query > Insert Data
    var queryStatement = {
      text: 'INSERT INTO questions(title, question, userId, tags, questionImage)\n      values($1, $2, $3, $4, $5) RETURNING *',
      values: [data.title, data.question, data.userId, data.tags, data.questionImage]
    };

    // require our query executor into our model
    return (0, _query2.default)(queryStatement);
  },
  findAll: function findAll(data) {
    var queryStatement = void 0;
    if (!data) {
      queryStatement = { // select all questions
        name: 'fetch-questions',
        text: 'SELECT * FROM questions'
      };
    } else if (data.where && data.order) {
      var key = Object.keys(data.where)[0];
      // select all questions filter by the value of a key and  ordered by a field
      queryStatement = {
        name: 'fetch-questions',
        text: 'SELECT * FROM questions WHERE ' + key + ' = $1\n        ORDER BY ' + data.order[0] + ' ' + data.order[1],
        values: [data.where[key]]
      };
    } else if (data.order) {
      queryStatement = { // select all questions ordered by a field
        name: 'fetch-questions',
        text: 'SELECT * FROM questions ORDER BY ' + data.order[0] + ' ' + data.order[1]
      };
    } else if (data.where) {
      var _key = Object.keys(data.where)[0];
      queryStatement = { // select all questions filter by the value of a key
        name: 'fetch-questions',
        text: 'SELECT * FROM questions WHERE ' + _key + ' = $1',
        values: [data.where[_key]]
      };
    }
    // require our query executor into our model
    return (0, _query2.default)(queryStatement);
  },
  findById: function findById(id) {
    // select a question
    var queryStatement = {
      name: 'fetch-question',
      text: 'SELECT * FROM questions WHERE id = $1',
      values: [id]
    };

    // require our query executor into our model
    return (0, _query2.default)(queryStatement);
  },
  destroy: function destroy(data) {
    var queryStatement = void 0;
    if (!data.where.id && data.force) {
      queryStatement = {
        text: 'DELETE FROM questions'
      };
    } else {
      queryStatement = {
        text: 'DELETE FROM questions WHERE id=($1)',
        values: [data.where.id]
      };
    }

    // require our query executor into our model
    return (0, _query2.default)(queryStatement);
  }
};

exports.default = Question;
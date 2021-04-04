'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _query = require('./database/query');

var _query2 = _interopRequireDefault(_query);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Answer = {
  create: function create(data) {
    // SQL Query > Insert Data
    var queryStatement = {
      text: 'INSERT INTO answers(response, userId, questionId, answerImage)\n      values($1, $2, $3, $4) RETURNING *',
      values: [data.response, data.userId, data.questionId, data.answerImage]
    };

    // require our query executor into our model
    return (0, _query2.default)(queryStatement);
  },
  update: function update(data) {
    // SQL Query > Update Data
    var queryStatement = {
      text: 'UPDATE answers SET response = $2, accepted = $3, vote = $4,\n      answerImage = $5, updatedAt = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *',
      values: [data.id, data.response, data.accepted, data.vote, data.answerImage]
    };

    // require our query executor into our model
    return (0, _query2.default)(queryStatement);
  },
  findById: function findById(id) {
    // select a answer
    var queryStatement = {
      name: 'fetch-answer',
      text: 'SELECT * FROM answers WHERE id = $1',
      values: [id]
    };

    // require our query executor into our model
    return (0, _query2.default)(queryStatement);
  },
  findOne: function findOne(data) {
    var key = Object.keys(data.where)[0];
    var queryStatement = {
      // give the query a unique username and password
      name: 'fetch-answer',
      text: 'SELECT * FROM answers WHERE ' + key + ' = $1\n      ORDER BY ' + data.order[0] + ' ' + data.order[1],
      values: [data.where[key]]
    };

    // require our query executor into our model
    return (0, _query2.default)(queryStatement);
  },
  destroy: function destroy(data) {
    var queryStatement = void 0;
    if (!data.where.id && data.force) {
      queryStatement = {
        text: 'DELETE FROM answers'
      };
    } else {
      queryStatement = {
        text: 'DELETE FROM answers WHERE id=($1)',
        values: [data.where.id]
      };
    }

    // require our query executor into our model
    return (0, _query2.default)(queryStatement);
  }
};

exports.default = Answer;
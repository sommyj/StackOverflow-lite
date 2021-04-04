'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _query = require('./database/query');

var _query2 = _interopRequireDefault(_query);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var User = {
  create: function create(data) {
    // SQL Query > Insert Data
    var queryStatement = {
      text: 'INSERT INTO users(title, firstname, lastname, username, password, email, gender,\n        country, phone, userImage) values($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *',
      values: [data.title, data.firstname, data.lastname, data.username, data.password, data.email, data.gender, data.country, data.phone, data.userImage]
    };

    // require our query executor into our model
    return (0, _query2.default)(queryStatement);
  },
  findAll: function findAll() {
    // select all users
    var queryStatement = {
      name: 'fetch-users',
      text: 'SELECT * FROM users'
    };

    // require our query executor into our model
    return (0, _query2.default)(queryStatement);
  },
  findOne: function findOne(data) {
    var key = Object.keys(data.where)[0];
    var queryStatement = {
      // give the query a unique username and password
      name: 'fetch-user',
      text: 'SELECT * FROM users WHERE ' + key + ' = $1',
      values: [data.where[key]]
    };

    // require our query executor into our model
    return (0, _query2.default)(queryStatement);
  },
  destroy: function destroy(data) {
    var queryStatement = void 0;
    if (!data.where.id && data.force) {
      queryStatement = {
        text: 'DELETE FROM users'
      };
    } else {
      queryStatement = {
        text: 'DELETE FROM users WHERE id=($1)',
        values: [data.where.id]
      };
    }

    // require our query executor into our model
    return (0, _query2.default)(queryStatement);
  }
};

exports.default = User;
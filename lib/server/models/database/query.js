'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _dbConnection = require('./dbConnection');

var _dbConnection2 = _interopRequireDefault(_dbConnection);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _ref = [_dbConnection2.default.pool],
    pool = _ref[0];


var query = function query(queryStatement) {
  return pool.query(queryStatement);
};

exports.default = query;
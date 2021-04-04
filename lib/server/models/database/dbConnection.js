'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _pg = require('pg');

var _pg2 = _interopRequireDefault(_pg);

var _config = require('../../config/config.json');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var env = process.env.NODE_ENV;
var Pool = _pg2.default.Pool,
    Client = _pg2.default.Client;


var connectionString = void 0;

if (env === 'test') {
  connectionString = process.env[_config2.default.test.use_env_variable];
} else if (env === 'production') {
  connectionString = process.env[_config2.default.production.use_env_variable];
} else {
  connectionString = process.env[_config2.default.development.use_env_variable];
}

/*
 *Pool connection for postgresql
 */
var pool = new Pool({ connectionString: connectionString });

/*
 *A client connection for postgresql
 *connect method has to be called in file to be used
 */
var client = new Client({ connectionString: connectionString });

var connections = { pool: pool, client: client };

exports.default = connections;
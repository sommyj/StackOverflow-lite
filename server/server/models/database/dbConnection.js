import pg from 'pg';
import config from '../../config/config.json';

const env = process.env.NODE_ENV;
const { Pool, Client } = pg;

let connectionString;

if (env === 'test') {
  connectionString = process.env[config.test.use_env_variable];
} else if (env === 'production') {
  connectionString = process.env[config.production.use_env_variable];
} else {
  connectionString = process.env[config.development.use_env_variable];
}

/*
 *Pool connection for postgresql
 */
const pool = new Pool({ connectionString });

/*
 *A client connection for postgresql
 *connect method has to be called in file to be used
 */
const client = new Client({ connectionString });

const connections = { pool, client };

export default connections;

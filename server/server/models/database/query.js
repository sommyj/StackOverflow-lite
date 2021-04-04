import connections from './dbConnection';

const [pool] = [connections.pool];

const query = (queryStatement) => pool.query(queryStatement);

export default query;

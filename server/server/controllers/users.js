// import pg from 'pg';
// import config from '../config/config.json';
// const env = process.env.NODE_ENV;
//
// let connectionString;
//
// if(env == 'test') {
//   connectionString = process.env[config.test.use_env_variable];
// } else if(env == 'production') {
//   connectionString = process.env[config.production.use_env_variable];
// } else {
//   connectionString = process.env[config.development.use_env_variable];
// }
//
// const client = new pg.Client(connectionString);
//
// const usersController = {
//   create(req, res) {
//     // Grab data from http request
//   const data = {title: req.body.text, complete: false};
//   // Get a Postgres client from the connection pool
//     pg.connect(connectionString, (err, client, done) => {
//       // Handle connection errors
//       if(err) {
//         done();
//         console.log(err);
//         return res.status(500).json({success: false, data: err});
//       }
//
//       // SQL Query > Insert Data
//     client.query(`INSERT INTO users(title, firstname, lastname, username, password, email, gender,
//       country, phone, userImage) values($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
//     [data.text, data.complete]);
//     // SQL Query > Select Data
//     const query = client.query('SELECT * FROM items ORDER BY id ASC');
//     // Stream results back one row at a time
//     query.on('row', (row) => {
//       results.push(row);
//     });
//     // After all data is returned, close connection and return results
//     query.on('end', () => {
//       done();
//       return res.json(results);
//     });
//
//
//
//
//     });
//   },
//   // login with username and password
//   check(req, res) {
//   },
// };
//
// export default usersController;

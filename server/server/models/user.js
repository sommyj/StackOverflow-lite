import query from './database/query';

const User = {
  create(data) {
    // SQL Query > Insert Data
    const queryStatement = {
      text: `INSERT INTO users(title, firstname, lastname, username, password, email, gender,
        country, phone, userImage) values($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
      values: [data.title, data.firstname, data.lastname, data.username, data.password,
        data.email, data.gender, data.country, data.phone, data.userImage],
    };

    // require our query executor into our model
    return query(queryStatement);
  },
  findAll() {
    // select all users
    const queryStatement = {
      name: 'fetch-users',
      text: 'SELECT * FROM users'
    };

    // require our query executor into our model
    return query(queryStatement);
  },
  findOne(data) {
    const key = Object.keys(data.where)[0];
    const queryStatement = {
      // give the query a unique username and password
      name: 'fetch-user',
      text: `SELECT * FROM users WHERE ${key} = $1`,
      values: [data.where[key]]
    };

    // require our query executor into our model
    return query(queryStatement);
  },
  destroy(data) {
    let queryStatement;
    if (!data.where.id && data.force) {
      queryStatement = {
        text: 'DELETE FROM users',
      };
    } else {
      queryStatement = {
        text: 'DELETE FROM users WHERE id=($1)',
        values: [data.where.id],
      };
    }

    // require our query executor into our model
    return query(queryStatement);
  }
};

export default User;

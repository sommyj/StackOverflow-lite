import query from './database/query';

const Answer = {
  create(data) {
    // SQL Query > Insert Data
    const queryStatement = {
      text: `INSERT INTO answers(response, userId, questionId, answerImage)
      values($1, $2, $3, $4) RETURNING *`,
      values: [data.response, data.userId, data.questionId, data.answerImage],
    };

    // require our query executor into our model
    return query(queryStatement);
  },
  update(data) {
    // SQL Query > Update Data
    const queryStatement = {
      text: `UPDATE answers SET response = $2, accepted = $3, vote = $4,
      answerImage = $5, updatedAt = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *`,
      values: [data.id, data.response, data.accepted, data.vote, data.answerImage],
    };

    // require our query executor into our model
    return query(queryStatement);
  },
  findById(id) {
    // select a answer
    const queryStatement = {
      name: 'fetch-answer',
      text: 'SELECT * FROM answers WHERE id = $1',
      values: [id],
    };

    // require our query executor into our model
    return query(queryStatement);
  },
  findOne(data) {
    const key = Object.keys(data.where)[0];
    const queryStatement = {
      // give the query a unique username and password
      name: 'fetch-answer',
      text: `SELECT * FROM answers WHERE ${key} = $1
      ORDER BY ${data.order[0]} ${data.order[1]}`,
      values: [data.where[key]],
    };

    // require our query executor into our model
    return query(queryStatement);
  },
  destroy(data) {
    let queryStatement;
    if (!data.where.id && data.force) {
      queryStatement = {
        text: 'DELETE FROM answers',
      };
    } else {
      queryStatement = {
        text: 'DELETE FROM answers WHERE id=($1)',
        values: [data.where.id],
      };
    }

    // require our query executor into our model
    return query(queryStatement);
  },
};

export default Answer;

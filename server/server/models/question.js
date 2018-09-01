import query from './database/query';

const Question = {
  create(data) {
    // SQL Query > Insert Data
    const queryStatement = {
      text: `INSERT INTO questions(title, question, userId, tags, questionImage)
      values($1, $2, $3, $4, $5) RETURNING *`,
      values: [data.title, data.question, data.userId, data.tags, data.questionImage],
    };

    // require our query executor into our model
    return query(queryStatement);
  },
  findAll() {
    // select all users
    const queryStatement = {
      name: 'fetch-questions',
      text: 'SELECT * FROM questions'
    };

    // require our query executor into our model
    return query(queryStatement);
  },
  destroy(data) {
    let queryStatement;
    if (!data.where.id && data.force) {
      queryStatement = {
        text: 'DELETE FROM questions',
      };
    } else {
      queryStatement = {
        text: 'DELETE FROM questions WHERE id=($1)',
        values: [data.where.id],
      };
    }

    // require our query executor into our model
    return query(queryStatement);
  }
};

export default Question;

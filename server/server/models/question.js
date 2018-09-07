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
  findAll(data) {
    let queryStatement;
    if(!data) {
      queryStatement = { // select all questions
        name: 'fetch-questions',
        text: 'SELECT * FROM questions'
      };
    } else if(data.order){
      queryStatement = { // select all questions
        name: 'fetch-questions',
        text: `SELECT * FROM questions ORDER BY ${data.order[0]} ${data.order[1]}`
      };
    }
    // require our query executor into our model
    return query(queryStatement);
  },
  findById(id) {
    // select a question
    const queryStatement = {
      name: 'fetch-question',
      text: 'SELECT * FROM questions WHERE id = $1',
      values: [id]
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

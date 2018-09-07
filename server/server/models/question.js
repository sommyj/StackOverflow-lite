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
    } else if(data.where && data.order) {
      const key = Object.keys(data.where)[0];
      // select all questions filter by the value of a key and  ordered by a field
      queryStatement = {
        name: 'fetch-questions',
        text: `SELECT * FROM questions WHERE ${key} = $1
        ORDER BY ${data.order[0]} ${data.order[1]}`,
        values: [data.where[key]]
      };
    } else if(data.order) {
        queryStatement = { // select all questions ordered by a field
          name: 'fetch-questions',
          text: `SELECT * FROM questions ORDER BY ${data.order[0]} ${data.order[1]}`
        };
    } else if(data.where) {
        const key = Object.keys(data.where)[0];
        queryStatement = { // select all questions filter by the value of a key
          name: 'fetch-questions',
          text: `SELECT * FROM questions WHERE ${key} = $1`,
          values: [data.where[key]]
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

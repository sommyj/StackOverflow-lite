import query from './database/query';

const Answer = {
  create(data) {
    // SQL Query > Insert Data
    const queryStatement = {
      text: `INSERT INTO answers(response, userId, questionId, accepted, vote, answerImage)
      values($1, $2, $3, $4, $5, $6) RETURNING *`,
      values: [data.response, data.userId, data.questionId, data.accepted,
        data.vote, data.answerImage],
    };

    // require our query executor into our model
    return query(queryStatement);
  },
};

export default Answer;

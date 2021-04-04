/* eslint-disable no-console */
import connections from './dbConnection';

const [client] = [connections.client];

client.connect((err) => {
  if (err) {
    console.error('connection error', err.stack);
  } else {
    console.log('connected');
  }
});

/*
 * Deletion of User, Question, Answers and Comments Table
 */
client.query(
  'DROP TABLE users, questions, answers, comments',
)
  .then((result) => { if (result.command === 'DROP') console.log('Tables are dropped'); })
  .catch((e) => console.error(e.stack))
  .then(() => client.end());
/* eslint-enable no-console */

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
 * User, Question, Answers and Comments Table creation
 */
client.query(
  `CREATE TABLE users(id SERIAL PRIMARY KEY, title CHAR(10), firstname VARCHAR(50),
   lastname VARCHAR(50), username VARCHAR(50) UNIQUE NOT NULL, password VARCHAR(200) NOT NULL,
   email VARCHAR(50) UNIQUE NOT NULL, gender VARCHAR(6), country VARCHAR(30) NOT NULL,
   phone VARCHAR(15) UNIQUE, userImage VARCHAR(200), createdAt DATE NOT NULL DEFAULT CURRENT_DATE,
   updatedAt DATE NOT NULL DEFAULT CURRENT_DATE)`
)
  .then((result1) => {
    if (result1.command === 'CREATE') console.log('users table created');

    client.query(
      `CREATE TABLE questions(id SERIAL PRIMARY KEY, title VARCHAR(100) UNIQUE NOT NULL,
       question TEXT NOT NULL, userId INTEGER REFERENCES users(id) ON DELETE CASCADE,tags VARCHAR(50),
       questionImage VARCHAR(200), createdAt DATE NOT NULL DEFAULT CURRENT_DATE,
       updatedAt DATE NOT NULL DEFAULT CURRENT_DATE)`
    )
      .then((result2) => {
        if (result2.command === 'CREATE') console.log('questions table created');

        client.query(
          `CREATE TABLE answers(id SERIAL PRIMARY KEY, response TEXT NOT NULL, userId INTEGER REFERENCES users(id) ON DELETE CASCADE,
           questionId INTEGER REFERENCES answers(id) ON DELETE CASCADE, accepted BOOLEAN DEFAULT false,
           vote INTEGER NOT NULL DEFAULT 0, answerImage VARCHAR(200), createdAt DATE NOT NULL DEFAULT CURRENT_DATE,
           updatedAt DATE NOT NULL DEFAULT CURRENT_DATE)`
        )
          .then((result3) => {
            if (result3.command === 'CREATE') console.log('answers table created');

            client.query(
              `CREATE TABLE comments(id SERIAL PRIMARY KEY,response TEXT NOT NULL, userId INTEGER REFERENCES users(id),
               answersId INTEGER REFERENCES answers(id), createdAt DATE NOT NULL DEFAULT CURRENT_DATE,
               updatedAt DATE NOT NULL DEFAULT CURRENT_DATE)`
            )
              .then((result4) => { if (result4.command === 'CREATE') console.log('comments table created'); })
              .catch(e => console.error(e.stack))
              .then(() => client.end());
          }).catch((e) => {
            console.error(e.stack);
            client.end();
          });
      }).catch((e) => {
        console.error(e.stack);
        client.end();
      });
  }).catch((e) => {
    console.error(e.stack);
    client.end();
  });
/* eslint-enable no-console */

import pg from 'pg';
import config from '../config/config.json';
const env = process.env.NODE_ENV;

let connectionString;

if(env == 'test') {
  connectionString = process.env[config.test.use_env_variable];
} else if(env == 'production') {
  connectionString = process.env[config.production.use_env_variable];
} else {
  connectionString = process.env[config.development.use_env_variable];
}

const client = new pg.Client(connectionString);

client.connect((err) => {
  if (err) {
    console.error('connection error', err.stack)
  } else {
    console.log('connected')
  }
})

const userQuery = client.query(
  `CREATE TABLE users(id SERIAL PRIMARY KEY, title CHAR(10), firstname VARCHAR(30),
   lastname VARCHAR(20), username VARCHAR(20) UNIQUE NOT NULL, password VARCHAR(20) NOT NULL,
   email VARCHAR(30) UNIQUE NOT NULL, gender CHAR(6), country VARCHAR(20) NOT NULL, phone CHAR(15) UNIQUE,
   userImage VARCHAR(50), createdAt DATE NOT NULL DEFAULT CURRENT_DATE,
   updatedAt DATE NOT NULL DEFAULT CURRENT_DATE)`)
   .then((result) => { console.log(`users table created`)

 const questionQuery = client.query(
   `CREATE TABLE questions(id SERIAL PRIMARY KEY, question VARCHAR(100), userId INTEGER REFERENCES users(id),
    tags VARCHAR(40), createdAt DATE NOT NULL DEFAULT CURRENT_DATE, updatedAt DATE NOT NULL DEFAULT CURRENT_DATE)`)
    .then((result) => { console.log(`questions table created`)

   const answerQuery = client.query(
     `CREATE TABLE answers(id SERIAL PRIMARY KEY, response VARCHAR(100),userId INTEGER REFERENCES users(id),
      questionId INTEGER REFERENCES answers(id), acceptedAnsId BOOLEAN DEFAULT false,vote INTEGER NOT NULL DEFAULT 0,
      createdAt DATE NOT NULL DEFAULT CURRENT_DATE, updatedAt DATE NOT NULL DEFAULT CURRENT_DATE)`)
      .then((result) => { console.log(`answers table created`)

     const commentQuery = client.query(
       `CREATE TABLE comments(id SERIAL PRIMARY KEY, userId INTEGER REFERENCES users(id),
        answersId INTEGER REFERENCES answers(id), createdAt DATE NOT NULL DEFAULT CURRENT_DATE,
        updatedAt DATE NOT NULL DEFAULT CURRENT_DATE)`)
        .then(result => console.log(`comments table created`))
        .catch(e => console.error(e.stack))
        .then(() => client.end())

    }).catch(e => {
      console.error(e.stack)
      client.end()
    });

  }).catch(e => {
    console.error(e.stack)
    client.end()
  });

}).catch(e => {
  console.error(e.stack)
  client.end()
});

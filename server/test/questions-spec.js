import chai from 'chai';
import supertest from 'supertest';
import path from 'path';
import chaiHttp from 'chai-http';

import app from '../app';
import model from '../server/models';
import fsHelper from '../utilities/fileSystem';

process.env.NODE_ENV = 'test';

chai.should();
chai.use(chaiHttp);
const request = supertest(app);
const [User] = [model.User];
const [Question] = [model.Question];

// Delete file helper method
const [deleteFile] = [fsHelper.deleteFile];

describe('Questions', () => {
  beforeEach((done) => { // Before each test we empty the database
    User.destroy({ where: {}, force: true });
    Question.destroy({ where: {}, force: true }).then(() => done());
  });

  describe('/GET question', () => {
    it('it should GET all the questions without data', (done) => {
      request
        .get('/v1/questions')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.questions.should.be.a('array');
          res.body.should.have.property('auth').eql(false);
          res.body.questions.length.should.be.eql(0);
          done();
        });
    });
    it('it should GET all the questions with data', (done) => {
      User.create({
        title: 'mr',
        firstname: 'justin',
        lastname: 'Ikwuoma',
        username: 'justman5',
        password: 'abc',
        email: 'justin5@gmail.com',
        gender: 'male',
        country: 'Nigeria',
        phone: '566976498',
        userImage: ''
      }).then((user) => {
        Question.create({
          title: 'I wannna know',
          question: 'I wannna know your name',
          userId: user.rows[0].id,
          tags: 'java',
          questionImage: '/something'
        }).then(() => {
          request
            .get('/v1/questions')
            .end((err, res) => {
              res.should.have.status(200);
              res.body.questions.should.be.a('array');
              res.body.should.have.property('auth').eql(false);
              res.body.questions.should.have.property(0);
              res.body.questions.should.have.deep.property('0').property('title').eql('I wannna know');
              res.body.questions.should.have.deep.property('0').property('question').eql('I wannna know your name');
              res.body.questions.should.have.deep.property('0').property('tags').eql('java');
              res.body.questions.should.have.deep.property('0').property('questionimage').eql('/something');
              done();
            });
        });
      });
    });

    it('it should GET all the questions with data and authenticate the user', (done) => {
      request
        .post('/auth/v1/signup')
        .field('title', 'mr')
        .field('firstname', 'Justin')
        .field('lastname', 'Ikwuoma')
        .field('username', 'justman')
        .field('password', 'abc')
        .field('email', 'justin@gmail.com')
        .field('gender', 'male')
        .field('country', 'Nigeria')
        .field('phone', '66979649')
        .attach('userImage', '')
        .end((err, res) => {
          request
            .post('/v1/questions')
            .set('x-access-token', res.body.token)
            .field('title', 'How far na')
            .field('question', 'I just wan no how u dey')
            .field('tags', 'java,javascript')
            .attach('questionImage', '')
            .end(() => {
              request
                .get('/v1/questions')
                .set('x-access-token', res.body.token)
                .end((err, res2) => {
                  res2.should.have.status(200);
                  res2.body.questions.should.be.a('array');
                  res2.body.should.have.property('auth').eql(true);
                  res2.body.should.have.property('questions');
                  res2.body.questions.should.have.property(0);
                  res2.body.questions.should.have.deep.property('0').property('title').eql('How far na');
                  res2.body.questions.should.have.deep.property('0').property('question').eql('I just wan no how u dey');
                  res2.body.questions.should.have.deep.property('0').property('tags').eql('java,javascript');
                  done();
                });
            });
        });
    });

    it('it should not GET a question by the given wrong id', (done) => {
      User.create({
        title: 'mr',
        firstname: 'justin',
        lastname: 'Ikwuoma',
        username: 'justman5',
        password: 'abc',
        email: 'justin5@gmail.com',
        gender: 'male',
        country: 'Nigeria',
        phone: '566976498',
        userImage: ''
      }).then((user) => {
        Question.create({
          title: 'I wannna know',
          question: 'I wannna know your name',
          userId: user.rows[0].id,
          tags: 'java,javascript',
          questionImage: '/something'
        }).then(() => {
          request
            .get('/v1/questions/-1')
            .end((err, res) => {
              res.should.have.status(404);
              res.body.should.be.a('object');
              res.body.should.have.property('message').eql('question not found');
              done();
            });
        });
      });
    });
    it('it should GET a question by the given id', (done) => {
      User.create({
        title: 'mr',
        firstname: 'justin',
        lastname: 'Ikwuoma',
        username: 'justman5',
        password: 'abc',
        email: 'justin5@gmail.com',
        gender: 'male',
        country: 'Nigeria',
        phone: '566976498',
        userImage: ''
      }).then((user) => {
        Question.create({
          title: 'I wannna know',
          question: 'I wannna know your name',
          userId: user.rows[0].id,
          tags: 'java,javascript',
          questionImage: '/something'
        }).then((question) => {
          request
            .get(`/v1/questions/${question.rows[0].id}`)
            .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('object');
              res.body.should.have.property('id').eql(res.body.id);
              res.body.should.have.property('title').eql('I wannna know');
              res.body.should.have.property('question').eql('I wannna know your name');
              res.body.should.have.property('tags').eql('java,javascript');
              res.body.should.have.property('questionimage').eql('/something');
              res.body.should.have.property('answers').eql(res.body.answers);
              done();
            });
        });
      });
    });
  });

  describe('/POST question', () => {
    it('it should not CREATE a question without title, question, tags', (done) => {
      request
        .post('/auth/v1/signup')
        .field('title', 'mr')
        .field('firstname', 'Justin')
        .field('lastname', 'Ikwuoma')
        .field('username', 'justman1')
        .field('password', 'abc')
        .field('email', 'justin1@gmail.com')
        .field('gender', 'male')
        .field('country', 'Nigeria')
        .field('phone', '669796498')
        .attach('userImage', '')
        .end((err, res) => {
          request
            .post('/v1/questions')
            .set('x-access-token', res.body.token)
            .field('title', '')
            .field('question', '')
            .field('tags', '')
            .attach('questionImage', './testFile.png')
            .end((err, res) => {
              res.should.have.status(206);
              res.body.should.be.a('object');
              res.body.should.have.property('message').eql('Incomplete field');
              done();
            });
        });
    });
    it('it should CREATE a question', (done) => {
      request
        .post('/auth/v1/signup')
        .field('title', 'mr')
        .field('firstname', 'Justin')
        .field('lastname', 'Ikwuoma')
        .field('username', 'justman')
        .field('password', 'abc')
        .field('email', 'justin@gmail.com')
        .field('gender', 'male')
        .field('country', 'Nigeria')
        .field('phone', '66979649')
        .attach('userImage', '')
        .end((err, res) => {
          request
            .post('/v1/questions')
            .set('x-access-token', res.body.token)
            .field('title', 'How far na')
            .field('question', 'I just wan no how u dey')
            .field('tags', 'java,javascript')
            .attach('questionImage', './testFile.png')
            .end((err, res) => {
              res.should.have.status(201);
              res.body.should.be.a('object');
              res.body.should.have.property('id').eql(res.body.id);
              res.body.should.have.property('title').eql('How far na');
              res.body.should.have.property('question').eql('I just wan no how u dey');
              res.body.should.have.property('tags').eql('java,javascript');
              res.body.should.have.property('questionimage').eql(res.body.questionimage);

              // delete test image file
              if (path.resolve('./testFile.png')) {
                deleteFile(`./${res.body.questionimage}`);
              }
              done();
            });
        });
    });
    it('it should CREATE a question without image', (done) => {
      request
        .post('/auth/v1/signup')
        .field('title', 'mr')
        .field('firstname', 'Justin')
        .field('lastname', 'Ikwuoma')
        .field('username', 'justman')
        .field('password', 'abc')
        .field('email', 'justin@gmail.com')
        .field('gender', 'male')
        .field('country', 'Nigeria')
        .field('phone', '66979649')
        .attach('userImage', '')
        .end((err, res) => {
          request
            .post('/v1/questions')
            .set('x-access-token', res.body.token)
            .field('title', 'How far na')
            .field('question', 'I just wan no how u dey')
            .field('tags', 'java,javascript')
            .attach('questionImage', '')
            .end((err, res) => {
              res.should.have.status(201);
              res.body.should.be.a('object');
              res.body.should.have.property('id').eql(res.body.id);
              res.body.should.have.property('title').eql('How far na');
              res.body.should.have.property('question').eql('I just wan no how u dey');
              res.body.should.have.property('tags').eql('java,javascript');
              res.body.should.have.property('questionimage').eql('');

              done();
            });
        });
    });
    it('it should not CREATE a question when image file type not jpg/png', (done) => {
      request
        .post('/auth/v1/signup')
        .field('title', 'mr')
        .field('firstname', 'Justin')
        .field('lastname', 'Ikwuoma')
        .field('username', 'justman')
        .field('password', 'abc')
        .field('email', 'justin@gmail.com')
        .field('gender', 'male')
        .field('country', 'Nigeria')
        .field('phone', '66979649')
        .attach('userImage', '')
        .end((err, res) => {
          request
            .post('/v1/questions')
            .set('x-access-token', res.body.token)
            .field('title', 'How far na')
            .field('question', 'I just wan no how u dey')
            .field('tags', 'java,javascript')
            .attach('questionImage', './testFileType.txt')
            .end((err, res) => {
              res.should.have.status(403);
              res.body.should.be.a('object');
              res.body.should.have.property('message').eql('Only .png and .jpg files are allowed!');
              res.body.should.have.property('error').eql(true);
              done();
            });
        });
    });
    it('it should not CREATE a question when image file size is larger than 2mb', (done) => {
      request
        .post('/auth/v1/signup')
        .field('title', 'mr')
        .field('firstname', 'Justin')
        .field('lastname', 'Ikwuoma')
        .field('username', 'justman')
        .field('password', 'abc')
        .field('email', 'justin@gmail.com')
        .field('gender', 'male')
        .field('country', 'Nigeria')
        .field('phone', '66979649')
        .attach('userImage', '')
        .end((err, res) => {
          request
            .post('/v1/questions')
            .set('x-access-token', res.body.token)
            .field('title', 'How far na')
            .field('question', 'I just wan no how u dey')
            .field('tags', 'java,javascript')
            .attach('questionImage', './testFileSize.jpg')
            .end((err, res) => {
              res.should.have.status(403);
              res.body.should.be.a('object');
              res.body.should.have.property('message')
                .eql('file should not be more than 2mb!');
              res.body.should.have.property('error').eql(true);
              done();
            });
        });
    });
    it('it should not CREATE a question when a token is not provided', (done) => {
      request
        .post('/auth/v1/signup')
        .field('title', 'mr')
        .field('firstname', 'Justin')
        .field('lastname', 'Ikwuoma')
        .field('username', 'justman')
        .field('password', 'abc')
        .field('email', 'justin@gmail.com')
        .field('gender', 'male')
        .field('country', 'Nigeria')
        .field('phone', '66979649')
        .attach('userImage', '')
        .end(() => {
          request
            .post('/v1/questions')
            .field('title', 'How far na')
            .field('question', 'I just wan no how u dey')
            .field('tags', 'java,javascript')
            .attach('questionImage', './testFileSize.jpg')
            .end((err, res) => {
              res.should.have.status(401);
              res.body.should.be.a('object');
              res.body.should.have.property('auth').eql(false);
              res.body.should.have.property('message').eql('No token provided.');
              done();
            });
        });
    });
    it('it should not CREATE a question when it fails to authenticate token', (done) => {
      request
        .post('/auth/v1/signup')
        .field('title', 'mr')
        .field('firstname', 'Justin')
        .field('lastname', 'Ikwuoma')
        .field('username', 'justman')
        .field('password', 'abc')
        .field('email', 'justin@gmail.com')
        .field('gender', 'male')
        .field('country', 'Nigeria')
        .field('phone', '66979649')
        .attach('userImage', '')
        .end(() => {
          request
            .post('/v1/questions')
            .set('x-access-token', 'jdkjdfskjs43354mxxnzsdz.drfsff.srfsf35324')
            .field('title', 'How far na')
            .field('question', 'I just wan no how u dey')
            .field('tags', 'java,javascript')
            .attach('questionImage', './testFileSize.jpg')
            .end((err, res) => {
              res.should.have.status(500);
              res.body.should.be.a('object');
              res.body.should.have.property('auth').eql(false);
              res.body.should.have.property('message').eql('Failed to authenticate token.');
              done();
            });
        });
    });
    it('it should not CREATE a question when user is delete but token exist', (done) => {
      request
        .post('/auth/v1/signup')
        .field('title', 'mr')
        .field('firstname', 'Justin')
        .field('lastname', 'Ikwuoma')
        .field('username', 'justman')
        .field('password', 'abc')
        .field('email', 'justin@gmail.com')
        .field('gender', 'male')
        .field('country', 'Nigeria')
        .field('phone', '66979649')
        .attach('userImage', '')
        .end((err, res) => {
          User.destroy({ where: { id: res.body.user.id } }).then(() => {
            request
              .post('/v1/questions')
              .set('x-access-token', res.body.token)
              .field('title', 'How far na')
              .field('question', 'I just wan no how u dey')
              .field('tags', 'java,javascript')
              .attach('questionImage', './testFile.png')
              .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                res.body.should.have.property('message')
                  .eql('user has been removed from the database');
                done();
              });
          });
        });
    });
  });

  /*
  * Test the /DELETE/:id route
  */
  describe('/DELETE/:id question', () => {
    it('it should not DELETE a queston given the wrong id', (done) => {
      request
        .post('/auth/v1/signup')
        .field('title', 'mr')
        .field('firstname', 'Justin')
        .field('lastname', 'Ikwuoma')
        .field('username', 'justman')
        .field('password', 'abc')
        .field('email', 'justin@gmail.com')
        .field('gender', 'male')
        .field('country', 'Nigeria')
        .field('phone', '66979649')
        .attach('userImage', '')
        .end((err, res) => {
          request
            .post('/v1/questions')
            .field('title', 'How far na')
            .field('question', 'I just wan no how u dey')
            .field('tags', 'java,javascript')
            .attach('questionImage', '')
            .end(() => {
              request
                .delete('/v1/questions/-1')
                .set('x-access-token', res.body.token)
                .end((err, res) => {
                  res.should.have.status(404);
                  res.body.should.be.a('object');
                  res.body.should.have.property('message').eql('question not found');
                  done();
                });
            });
        });
    });
    it('it should not DELETE a queston when a token is not provided', (done) => {
      request
        .post('/auth/v1/signup')
        .field('title', 'mr')
        .field('firstname', 'Justin')
        .field('lastname', 'Ikwuoma')
        .field('username', 'justman')
        .field('password', 'abc')
        .field('email', 'justin@gmail.com')
        .field('gender', 'male')
        .field('country', 'Nigeria')
        .field('phone', '66979649')
        .attach('userImage', '')
        .end((err1, res1) => {
          request
            .post('/v1/questions')
            .set('x-access-token', res1.body.token)
            .field('title', 'How far na')
            .field('question', 'I just wan no how u dey')
            .field('tags', 'java,javascript')
            .attach('questionImage', '')
            .end((err2, res2) => {
              request
                .delete(`/v1/questions/${res2.body.id}`)
                .end((err, res) => {
                  res.should.have.status(401);
                  res.body.should.be.a('object');
                  res.body.should.have.property('auth').eql(false);
                  res.body.should.have.property('message').eql('No token provided.');
                  done();
                });
            });
        });
    });
    it('it should not DELETE a queston when it fails to authenticate token', (done) => {
      request
        .post('/auth/v1/signup')
        .field('title', 'mr')
        .field('firstname', 'Justin')
        .field('lastname', 'Ikwuoma')
        .field('username', 'justman')
        .field('password', 'abc')
        .field('email', 'justin@gmail.com')
        .field('gender', 'male')
        .field('country', 'Nigeria')
        .field('phone', '66979649')
        .attach('userImage', '')
        .end((err1, res1) => {
          request
            .post('/v1/questions')
            .set('x-access-token', res1.body.token)
            .field('title', 'How far na')
            .field('question', 'I just wan no how u dey')
            .field('tags', 'java,javascript')
            .attach('questionImage', '')
            .end((err2, res2) => {
              request
                .delete(`/v1/questions/${res2.body.id}`)
                .set('x-access-token', 'jdkjdfskjs43354mxxnzsdz.drfsff.srfsf35324')
                .end((err, res) => {
                  res.should.have.status(500);
                  res.body.should.be.a('object');
                  res.body.should.have.property('auth').eql(false);
                  res.body.should.have.property('message').eql('Failed to authenticate token.');
                  done();
                });
            });
        });
    });
    it('it should DELETE a queston given the id', (done) => {
      request
        .post('/auth/v1/signup')
        .field('title', 'mr')
        .field('firstname', 'Justin')
        .field('lastname', 'Ikwuoma')
        .field('username', 'justman')
        .field('password', 'abc')
        .field('email', 'justin@gmail.com')
        .field('gender', 'male')
        .field('country', 'Nigeria')
        .field('phone', '66979649')
        .attach('userImage', '')
        .end((err1, res1) => {
          User.create({
            title: 'mr',
            firstname: 'Justin1',
            lastname: 'Ikwuoma',
            username: 'justman4',
            password: 'abc',
            email: 'justin4@gmail.com',
            gender: 'male',
            country: 'Nigeria',
            phone: '4466976498',
            userImage: ''
          }).then((user) => {
            Question.create({
              title: 'I wannna know',
              question: 'I wannna know your name',
              userId: user.rows[0].id,
              tags: 'java,javascript',
              questionImage: 'hhhhjjh'
            }).then((question) => {
              request
                .delete(`/v1/questions/${question.rows[0].id}`)
                .set('x-access-token', res1.body.token)
                .end((err, res) => {
                  res.should.have.status(403);
                  res.body.should.be.a('object');
                  res.body.should.have.property('auth').eql(false);
                  res.body.should.have.property('message').eql('User not allowed');
                  done();
                });
            });
          });
        });
    });
    it('it should DELETE a queston given the id', (done) => {
      request
        .post('/auth/v1/signup')
        .field('title', 'mr')
        .field('firstname', 'Justin')
        .field('lastname', 'Ikwuoma')
        .field('username', 'justman')
        .field('password', 'abc')
        .field('email', 'justin@gmail.com')
        .field('gender', 'male')
        .field('country', 'Nigeria')
        .field('phone', '66979649')
        .attach('userImage', '')
        .end((err1, res1) => {
          request
            .post('/v1/questions')
            .set('x-access-token', res1.body.token)
            .field('title', 'How far na')
            .field('question', 'I just wan no how u dey')
            .field('tags', 'java,javascript')
            .attach('questionImage', './testFile.png')
            .end((err2, res2) => {
              request
                .delete(`/v1/questions/${res2.body.id}`)
                .set('x-access-token', res1.body.token)
                .end((err, res) => {
                  res.should.have.status(204);
                  res.body.should.be.a('object');
                  done();
                });
            });
        });
    });
  });
});

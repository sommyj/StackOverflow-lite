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
const [Answer] = [model.Answer];

// Delete file helper method
const [deleteFile] = [fsHelper.deleteFile];

describe('Answers', () => {
  beforeEach((done) => { // Before each test we empty the database
    User.destroy({ where: {}, force: true });
    Question.destroy({ where: {}, force: true });
    Answer.destroy({ where: {}, force: true }).then(() => done());
  });

  describe('/POST answer', () => {
    it('it should not CREATE an answer without response', (done) => {
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
                .post(`/v1/questions/${res2.body.id}/answers`)
                .set('x-access-token', res1.body.token)
                .field('response', '')
                .attach('answerImage', '')
                .end((err, res) => {
                  res.should.have.status(206);
                  res.body.should.be.a('object');
                  res.body.should.have.property('message').eql('Incomplete field');

                  done();
                });
            });
        });
    });
    it('it should CREATE an answer', (done) => {
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
                .post(`/v1/questions/${res2.body.id}/answers`)
                .set('x-access-token', res1.body.token)
                .field('response', 'very fine')
                .attach('answerImage', './testFile.png')
                .end((err, res) => {
                  res.should.have.status(201);
                  res.body.should.be.a('object');
                  res.body.should.have.property('response').eql('very fine');
                  res.body.should.have.property('userid').eql(res1.body.user.id);
                  res.body.should.have.property('accepted').eql(false);
                  res.body.should.have.property('vote').eql(0);
                  res.body.should.have.property('answerimage').eql(res.body.answerimage);

                  // delete test image file
                  if (path.resolve('./testFile.png')) {
                    deleteFile(`./${res.body.answerimage}`);
                  }
                  done();
                });
            });
        });
    });
    it('it should CREATE an answer without image', (done) => {
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
                .post(`/v1/questions/${res2.body.id}/answers`)
                .set('x-access-token', res1.body.token)
                .field('response', 'very fine')
                .attach('answerImage', '')
                .end((err, res) => {
                  res.should.have.status(201);
                  res.body.should.be.a('object');
                  res.body.should.have.property('response').eql('very fine');
                  res.body.should.have.property('userid').eql(res1.body.user.id);
                  res.body.should.have.property('accepted').eql(false);
                  res.body.should.have.property('vote').eql(0);
                  res.body.should.have.property('answerimage').eql('');

                  done();
                });
            });
        });
    });
    it('it should not CREATE an answer when image file type not jpg/png', (done) => {
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
                .post(`/v1/questions/${res2.body.id}/answers`)
                .set('x-access-token', res1.body.token)
                .field('response', 'very fine')
                .attach('answerImage', './testFileType.txt')
                .end((err, res) => {
                  res.should.have.status(403);
                  res.body.should.be.a('object');
                  res.body.should.have.property('message').eql('Only .png and .jpg files are allowed!');
                  res.body.should.have.property('error').eql(true);

                  done();
                });
            });
        });
    });
    it('it should not CREATE an answer when image file size is larger than 2mb', (done) => {
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
                .post(`/v1/questions/${res2.body.id}/answers`)
                .set('x-access-token', res1.body.token)
                .field('response', 'very fine')
                .attach('answerImage', './testFileSize.jpg')
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
    });
    it('it should not CREATE an answer when a token is not provided', (done) => {
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
                .post(`/v1/questions/${res2.body.id}/answers`)
                .field('response', 'very fine')
                .attach('answerImage', './testFile.png')
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
    it('it should not CREATE an answer when it fails to authenticate token', (done) => {
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
                .post(`/v1/questions/${res2.body.id}/answers`)
                .set('x-access-token', 'jdkjdfskjs43354mxxnzsdz.drfsff.srfsf35324')
                .field('response', 'very fine')
                .attach('answerImage', './testFile.png')
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
    it('it should not CREATE an answer when user is delete but token exist', (done) => {
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
              User.destroy({ where: { id: res1.body.user.id } }).then(() => {
                request
                  .post(`/v1/questions/${res2.body.id}/answers`)
                  .set('x-access-token', res1.body.token)
                  .field('response', 'very fine')
                  .attach('answerImage', './testFile.png')
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
  });

  /*
   * Test the /PUT/:id route
   */
  describe('/PUT/:id answer', () => {
    it('it should UPDATE an answer given the answer id by the question author', (done) => {
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
                .post(`/v1/questions/${res2.body.id}/answers`)
                .set('x-access-token', res1.body.token)
                .field('response', 'very fine')
                .attach('answerImage', '')
                .end((err, res) => {
                  request
                    .put(`/v1/questions/${res2.body.id}/answers/${res.body.id}`)
                    .set('x-access-token', res1.body.token)
                    .field('accepted', true)
                    .end((err, res) => {
                      res.should.have.status(200);
                      res.body.should.be.a('object');
                      res.body.should.have.property('response').eql('very fine');
                      res.body.should.have.property('userid').eql(res1.body.user.id);
                      res.body.should.have.property('accepted').eql(true);
                      res.body.should.have.property('vote').eql(0);
                      res.body.should.have.property('answerimage').eql('');
                      done();
                    });
                });
            });
        });
    });

    it('it should UPDATE an answer given the answer id by the answer author', (done) => {
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
                .post(`/v1/questions/${res2.body.id}/answers`)
                .set('x-access-token', res1.body.token)
                .field('response', 'very fine')
                .attach('answerImage', '')
                .end((err, res) => {
                  request
                    .put(`/v1/questions/${res2.body.id}/answers/${res.body.id}`)
                    .set('x-access-token', res1.body.token)
                    .field('response', 'i am ok')
                    .attach('answerImage', './testFile.png')
                    .end((err, res) => {
                      res.should.have.status(200);
                      res.body.should.be.a('object');
                      res.body.should.have.property('response').eql('i am ok');
                      res.body.should.have.property('userid').eql(res1.body.user.id);
                      res.body.should.have.property('accepted').eql(false);
                      res.body.should.have.property('vote').eql(0);
                      res.body.should.have.property('answerimage').eql(res.body.answerimage);

                      // delete test image file
                      if (path.resolve('./testFile.png')) {
                        deleteFile(`./${res.body.answerimage}`);
                      }
                      done();
                    });
                });
            });
        });
    });
    it('it should not UPDATE an answer given the wrong answer id', (done) => {
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
                .post(`/v1/questions/${res2.body.id}/answers`)
                .set('x-access-token', res1.body.token)
                .field('response', 'very fine')
                .attach('answerImage', '')
                .end(() => {
                  request
                    .put(`/v1/questions/${res2.body.id}/answers/-1`)
                    .set('x-access-token', res1.body.token)
                    .field('response', 'i am ok')
                    .attach('answerImage', './testFile.png')
                    .end((err, res) => {
                      res.should.have.status(404);
                      res.body.should.be.a('object');
                      res.body.should.have.property('message').eql('answer not found');

                      done();
                    });
                });
            });
        });
    });
    it('it should not UPDATE an answer given the wrong question id', (done) => {
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
                .post(`/v1/questions/${res2.body.id}/answers`)
                .set('x-access-token', res1.body.token)
                .field('response', 'very fine')
                .attach('answerImage', '')
                .end((err, res) => {
                  request
                    .put(`/v1/questions/-1/answers/${res.body.id}`)
                    .set('x-access-token', res1.body.token)
                    .field('response', 'i am ok')
                    .attach('answerImage', './testFile.png')
                    .end((err, res) => {
                      res.should.have.status(404);
                      res.body.should.be.a('object');
                      res.body.should.have.property('message').eql('question not found');

                      done();
                    });
                });
            });
        });
    });
    it(`it should UPDATE an answer given the id and
    maintain already existing fields and file if none is entered`, (done) => {
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
                .post(`/v1/questions/${res2.body.id}/answers`)
                .set('x-access-token', res1.body.token)
                .field('response', 'very fine')
                .attach('answerImage', './testFile.png')
                .end((err, res) => {
                  request
                    .put(`/v1/questions/${res2.body.id}/answers/${res.body.id}`)
                    .set('x-access-token', res1.body.token)
                    .field('response', '')
                    .attach('answerImage', '')
                    .end((err, res) => {
                      res.should.have.status(200);
                      res.body.should.be.a('object');
                      res.body.should.have.property('response').eql('very fine');
                      res.body.should.have.property('userid').eql(res1.body.user.id);
                      res.body.should.have.property('accepted').eql(false);
                      res.body.should.have.property('vote').eql(0);
                      res.body.should.have.property('answerimage').eql(res.body.answerimage);

                      // delete test image file
                      if (path.resolve('./testFile.png')) {
                        deleteFile(`./${res.body.answerimage}`);
                      }
                      done();
                    });
                });
            });
        });
    });
    it('it should UPDATE a answer given the id and replace already existing file', (done) => {
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
                .post(`/v1/questions/${res2.body.id}/answers`)
                .set('x-access-token', res1.body.token)
                .field('response', 'very fine')
                .attach('answerImage', './testFile.png')
                .end((err, res) => {
                  request
                    .put(`/v1/questions/${res2.body.id}/answers/${res.body.id}`)
                    .set('x-access-token', res1.body.token)
                    .field('response', '')
                    .attach('answerImage', './testFile.png')
                    .end((err, res) => {
                      res.should.have.status(200);
                      res.body.should.be.a('object');
                      res.body.should.have.property('response').eql('very fine');
                      res.body.should.have.property('userid').eql(res1.body.user.id);
                      res.body.should.have.property('accepted').eql(false);
                      res.body.should.have.property('vote').eql(0);
                      res.body.should.have.property('answerimage').eql(res.body.answerimage);

                      // delete test image file
                      if (path.resolve('./testFile.png')) {
                        deleteFile(`./${res.body.answerimage}`);
                      }
                      done();
                    });
                });
            });
        });
    });
    it('it should not UPDATE an answer when image file type not jpg/png', (done) => {
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
                .post(`/v1/questions/${res2.body.id}/answers`)
                .set('x-access-token', res1.body.token)
                .field('response', 'very fine')
                .attach('answerImage', '')
                .end((err, res) => {
                  request
                    .put(`/v1/questions/${res2.body.id}/answers/${res.body.id}`)
                    .set('x-access-token', res1.body.token)
                    .field('response', '')
                    .attach('answerImage', './testFileType.txt')
                    .end((err, res) => {
                      res.should.have.status(403);
                      res.body.should.be.a('object');
                      res.body.should.have.property('message').eql('Only .png and .jpg files are allowed!');
                      res.body.should.have.property('error').eql(true);

                      done();
                    });
                });
            });
        });
    });
    it(`it should not UPDATE a answer
    when image file size is larger than 2mb`, (done) => {
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
                .post(`/v1/questions/${res2.body.id}/answers`)
                .set('x-access-token', res1.body.token)
                .field('response', 'very fine')
                .attach('answerImage', '')
                .end((err, res) => {
                  request
                    .put(`/v1/questions/${res2.body.id}/answers/${res.body.id}`)
                    .set('x-access-token', res1.body.token)
                    .field('response', '')
                    .attach('answerImage', './testFileSize.jpg')
                    .end((err, res) => {
                      res.should.have.status(403);
                      res.body.should.be.a('object');
                      res.body.should.have.property('message').eql('file should not be more than 2mb!');
                      res.body.should.have.property('error').eql(true);

                      done();
                    });
                });
            });
        });
    });
    it('it should not UPDATE an answer when a token is not provided', (done) => {
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
                .post(`/v1/questions/${res2.body.id}/answers`)
                .set('x-access-token', res1.body.token)
                .field('response', 'very fine')
                .attach('answerImage', '')
                .end((err, res) => {
                  request
                    .put(`/v1/questions/${res2.body.id}/answers/${res.body.id}`)
                    .field('response', '')
                    .attach('answerImage', '')
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
    });
    it('it should not UPDATE a answer when it fails to authenticate token.', (done) => {
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
                .post(`/v1/questions/${res2.body.id}/answers`)
                .set('x-access-token', res1.body.token)
                .field('response', 'very fine')
                .attach('answerImage', '')
                .end((err, res) => {
                  request
                    .put(`/v1/questions/${res2.body.id}/answers/${res.body.id}`)
                    .set('x-access-token', 'nmdhnjf.njfjfj.fkfkfk')
                    .field('response', '')
                    .attach('answerImage', '')
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
    });
    it('it should not UPDATE a answer when user is unauthorize.', (done) => {
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
              Answer.create({ response: 'very fine', answerImage: '' }).then((answer) => {
                request
                  .put(`/v1/questions/${res2.body.id}/answers/${answer.rows[0].id}`)
                  .set('x-access-token', res1.body.token)
                  .field('response', '')
                  .attach('answerImage', '')
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
  });
});

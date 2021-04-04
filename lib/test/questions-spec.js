'use strict';

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

var _supertest = require('supertest');

var _supertest2 = _interopRequireDefault(_supertest);

var _chaiHttp = require('chai-http');

var _chaiHttp2 = _interopRequireDefault(_chaiHttp);

var _app = require('../app');

var _app2 = _interopRequireDefault(_app);

var _models = require('../server/models');

var _models2 = _interopRequireDefault(_models);

var _filebaseStorage = require('../server/controllers/utilities/filebaseStorage');

var _filebaseStorage2 = _interopRequireDefault(_filebaseStorage);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; } /* eslint-disable no-console */


process.env.NODE_ENV = 'test';

_chai2.default.should();
_chai2.default.use(_chaiHttp2.default);
var request = (0, _supertest2.default)(_app2.default);
var _ref = [_models2.default.User],
    User = _ref[0];
var _ref2 = [_models2.default.Question],
    Question = _ref2[0];
var _ref3 = [_filebaseStorage2.default.deleteImageFromStorage],
    deleteImageFromStorage = _ref3[0];


describe('Questions', function () {
  beforeEach(function (done) {
    // Before each test we empty the database
    User.destroy({ where: {}, force: true });
    Question.destroy({ where: {}, force: true }).then(function () {
      return done();
    });
  });

  describe('/GET question', function () {
    it('it should GET all the questions without data', function (done) {
      request.get('/v1/questions').end(function (err, res) {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.questions.should.be.a('array');
        res.body.should.have.property('auth').eql(false);
        res.body.questions.length.should.be.eql(0);
        done();
      });
    });
    it('it should GET all the questions with data', function (done) {
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
      }).then(function (user) {
        Question.create({
          title: 'I wannna know',
          question: 'I wannna know your name',
          userId: user.rows[0].id,
          tags: 'java',
          questionImage: '/something'
        }).then(function () {
          request.get('/v1/questions').end(function (err, res) {
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

    it('it should GET all the questions with data and authenticate the user', function (done) {
      request.post('/auth/v1/signup').field('title', 'mr').field('firstname', 'Justin').field('lastname', 'Ikwuoma').field('username', 'justman').field('password', 'abc').field('email', 'justin@gmail.com').field('gender', 'male').field('country', 'Nigeria').field('phone', '66979649').attach('userImage', '').end(function (err, res) {
        request.post('/v1/questions').set('x-access-token', res.body.token).field('title', 'How far na').field('question', 'I just wan no how u dey').field('tags', 'java,javascript').attach('questionImage', '').end(function () {
          request.get('/v1/questions').set('x-access-token', res.body.token).end(function (err, res2) {
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

    it('it should not GET a question by the given wrong id', function (done) {
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
      }).then(function (user) {
        Question.create({
          title: 'I wannna know',
          question: 'I wannna know your name',
          userId: user.rows[0].id,
          tags: 'java,javascript',
          questionImage: '/something'
        }).then(function () {
          request.get('/v1/questions/-1').end(function (err, res) {
            res.should.have.status(404);
            res.body.should.be.a('object');
            res.body.should.have.property('message').eql('question not found');
            done();
          });
        });
      });
    });
    it('it should GET a question by the given id', function (done) {
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
      }).then(function (user) {
        Question.create({
          title: 'I wannna know',
          question: 'I wannna know your name',
          userId: user.rows[0].id,
          tags: 'java,javascript',
          questionImage: ''
        }).then(function (question) {
          request.get('/v1/questions/' + question.rows[0].id).end(function (err, res) {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('id').eql(res.body.id);
            res.body.should.have.property('title').eql('I wannna know');
            res.body.should.have.property('question').eql('I wannna know your name');
            res.body.should.have.property('tags').eql('java,javascript');
            res.body.should.have.property('questionimage').eql('');
            res.body.should.have.property('answers').eql(res.body.answers);
            done();
          });
        });
      });
    });
  });

  describe('/POST question', function () {
    it('it should not CREATE a question without title, question, tags', function (done) {
      request.post('/auth/v1/signup').field('title', 'mr').field('firstname', 'Justin').field('lastname', 'Ikwuoma').field('username', 'justman1').field('password', 'abc').field('email', 'justin1@gmail.com').field('gender', 'male').field('country', 'Nigeria').field('phone', '669796498').attach('userImage', '').end(function (err, res) {
        request.post('/v1/questions').set('x-access-token', res.body.token).field('title', '').field('question', '').field('tags', '').attach('questionImage', './testFile.png').end(function (err, res) {
          res.should.have.status(206);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('Incomplete field');
          done();
        });
      });
    });
    it('it should CREATE a question', function (done) {
      request.post('/auth/v1/signup').field('title', 'mr').field('firstname', 'Justin').field('lastname', 'Ikwuoma').field('username', 'justman').field('password', 'abc').field('email', 'justin@gmail.com').field('gender', 'male').field('country', 'Nigeria').field('phone', '66979649').attach('userImage', '').end(function (err, res) {
        request.post('/v1/questions').set('x-access-token', res.body.token).field('title', 'How far na').field('question', 'I just wan no how u dey').field('tags', 'java,javascript').attach('questionImage', './testFile.png').end(function () {
          var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(err, res) {
            return regeneratorRuntime.wrap(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    res.should.have.status(201);
                    res.body.should.be.a('object');
                    res.body.should.have.property('id').eql(res.body.id);
                    res.body.should.have.property('title').eql('How far na');
                    res.body.should.have.property('question').eql('I just wan no how u dey');
                    res.body.should.have.property('tags').eql('java,javascript');
                    res.body.should.have.property('questionimage').eql(res.body.questionimage);

                    if (!res.body.questionimage) {
                      _context.next = 16;
                      break;
                    }

                    _context.prev = 8;
                    _context.next = 11;
                    return deleteImageFromStorage(res.body.questionimage);

                  case 11:
                    _context.next = 16;
                    break;

                  case 13:
                    _context.prev = 13;
                    _context.t0 = _context['catch'](8);

                    console.error(_context.t0);

                  case 16:
                    done();

                  case 17:
                  case 'end':
                    return _context.stop();
                }
              }
            }, _callee, undefined, [[8, 13]]);
          }));

          return function (_x, _x2) {
            return _ref4.apply(this, arguments);
          };
        }());
      });
    });
    it('it should CREATE a question without image', function (done) {
      request.post('/auth/v1/signup').field('title', 'mr').field('firstname', 'Justin').field('lastname', 'Ikwuoma').field('username', 'justman').field('password', 'abc').field('email', 'justin@gmail.com').field('gender', 'male').field('country', 'Nigeria').field('phone', '66979649').attach('userImage', '').end(function (err, res) {
        request.post('/v1/questions').set('x-access-token', res.body.token).field('title', 'How far na').field('question', 'I just wan no how u dey').field('tags', 'java,javascript').attach('questionImage', '').end(function (err, res) {
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
    it('it should not CREATE a question when image file type not jpg/png', function (done) {
      request.post('/auth/v1/signup').field('title', 'mr').field('firstname', 'Justin').field('lastname', 'Ikwuoma').field('username', 'justman').field('password', 'abc').field('email', 'justin@gmail.com').field('gender', 'male').field('country', 'Nigeria').field('phone', '66979649').attach('userImage', '').end(function (err, res) {
        request.post('/v1/questions').set('x-access-token', res.body.token).field('title', 'How far na').field('question', 'I just wan no how u dey').field('tags', 'java,javascript').attach('questionImage', './testFileType.txt').end(function (err, res) {
          res.should.have.status(403);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('Only .png and .jpg files are allowed!');
          res.body.should.have.property('error').eql(true);
          done();
        });
      });
    });
    it('it should not CREATE a question when image file size is larger than 2mb', function (done) {
      request.post('/auth/v1/signup').field('title', 'mr').field('firstname', 'Justin').field('lastname', 'Ikwuoma').field('username', 'justman').field('password', 'abc').field('email', 'justin@gmail.com').field('gender', 'male').field('country', 'Nigeria').field('phone', '66979649').attach('userImage', '').end(function (err, res) {
        request.post('/v1/questions').set('x-access-token', res.body.token).field('title', 'How far na').field('question', 'I just wan no how u dey').field('tags', 'java,javascript').attach('questionImage', './testFileSize.jpg').end(function (err, res) {
          res.should.have.status(403);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('file should not be more than 2mb!');
          res.body.should.have.property('error').eql(true);
          done();
        });
      });
    });
    it('it should not CREATE a question when a token is not provided', function (done) {
      request.post('/auth/v1/signup').field('title', 'mr').field('firstname', 'Justin').field('lastname', 'Ikwuoma').field('username', 'justman').field('password', 'abc').field('email', 'justin@gmail.com').field('gender', 'male').field('country', 'Nigeria').field('phone', '66979649').attach('userImage', '').end(function () {
        request.post('/v1/questions').field('title', 'How far na').field('question', 'I just wan no how u dey').field('tags', 'java,javascript').attach('questionImage', './testFileSize.jpg').end(function (err, res) {
          res.should.have.status(401);
          res.body.should.be.a('object');
          res.body.should.have.property('auth').eql(false);
          res.body.should.have.property('message').eql('No token provided.');
          done();
        });
      });
    });
    it('it should not CREATE a question when it fails to authenticate token', function (done) {
      request.post('/auth/v1/signup').field('title', 'mr').field('firstname', 'Justin').field('lastname', 'Ikwuoma').field('username', 'justman').field('password', 'abc').field('email', 'justin@gmail.com').field('gender', 'male').field('country', 'Nigeria').field('phone', '66979649').attach('userImage', '').end(function () {
        request.post('/v1/questions').set('x-access-token', 'jdkjdfskjs43354mxxnzsdz.drfsff.srfsf35324').field('title', 'How far na').field('question', 'I just wan no how u dey').field('tags', 'java,javascript').attach('questionImage', './testFileSize.jpg').end(function (err, res) {
          res.should.have.status(500);
          res.body.should.be.a('object');
          res.body.should.have.property('auth').eql(false);
          res.body.should.have.property('message').eql('Failed to authenticate token.');
          done();
        });
      });
    });
    it('it should not CREATE a question when user is deleted but token exist', function (done) {
      request.post('/auth/v1/signup').field('title', 'mr').field('firstname', 'Justin').field('lastname', 'Ikwuoma').field('username', 'justman').field('password', 'abc').field('email', 'justin@gmail.com').field('gender', 'male').field('country', 'Nigeria').field('phone', '66979649').attach('userImage', '').end(function (err, res) {
        User.destroy({ where: { id: res.body.user.id } }).then(function () {
          request.post('/v1/questions').set('x-access-token', res.body.token).field('title', 'How far na').field('question', 'I just wan no how u dey').field('tags', 'java,javascript').attach('questionImage', './testFile.png').end(function (err, res) {
            res.should.have.status(400);
            res.body.should.be.a('object');
            res.body.should.have.property('message').eql('user has been removed from the database');
            done();
          });
        });
      });
    });
  });

  /*
  * Test the /DELETE/:id route
  */
  describe('/DELETE/:id question', function () {
    it('it should not DELETE a queston given the wrong id', function (done) {
      request.post('/auth/v1/signup').field('title', 'mr').field('firstname', 'Justin').field('lastname', 'Ikwuoma').field('username', 'justman').field('password', 'abc').field('email', 'justin@gmail.com').field('gender', 'male').field('country', 'Nigeria').field('phone', '66979649').attach('userImage', '').end(function (err, res) {
        request.post('/v1/questions').field('title', 'How far na').field('question', 'I just wan no how u dey').field('tags', 'java,javascript').attach('questionImage', '').end(function () {
          request.delete('/v1/questions/-1').set('x-access-token', res.body.token).end(function (err, res) {
            res.should.have.status(404);
            res.body.should.be.a('object');
            res.body.should.have.property('message').eql('question not found');
            done();
          });
        });
      });
    });
    it('it should not DELETE a queston when a token is not provided', function (done) {
      request.post('/auth/v1/signup').field('title', 'mr').field('firstname', 'Justin').field('lastname', 'Ikwuoma').field('username', 'justman').field('password', 'abc').field('email', 'justin@gmail.com').field('gender', 'male').field('country', 'Nigeria').field('phone', '66979649').attach('userImage', '').end(function (err1, res1) {
        request.post('/v1/questions').set('x-access-token', res1.body.token).field('title', 'How far na').field('question', 'I just wan no how u dey').field('tags', 'java,javascript').attach('questionImage', '').end(function (err2, res2) {
          request.delete('/v1/questions/' + res2.body.id).end(function (err, res) {
            res.should.have.status(401);
            res.body.should.be.a('object');
            res.body.should.have.property('auth').eql(false);
            res.body.should.have.property('message').eql('No token provided.');
            done();
          });
        });
      });
    });
    it('it should not DELETE a queston when it fails to authenticate token', function (done) {
      request.post('/auth/v1/signup').field('title', 'mr').field('firstname', 'Justin').field('lastname', 'Ikwuoma').field('username', 'justman').field('password', 'abc').field('email', 'justin@gmail.com').field('gender', 'male').field('country', 'Nigeria').field('phone', '66979649').attach('userImage', '').end(function (err1, res1) {
        request.post('/v1/questions').set('x-access-token', res1.body.token).field('title', 'How far na').field('question', 'I just wan no how u dey').field('tags', 'java,javascript').attach('questionImage', '').end(function (err2, res2) {
          request.delete('/v1/questions/' + res2.body.id).set('x-access-token', 'jdkjdfskjs43354mxxnzsdz.drfsff.srfsf35324').end(function (err, res) {
            res.should.have.status(500);
            res.body.should.be.a('object');
            res.body.should.have.property('auth').eql(false);
            res.body.should.have.property('message').eql('Failed to authenticate token.');
            done();
          });
        });
      });
    });
    it('it should DELETE a queston given the id', function (done) {
      request.post('/auth/v1/signup').field('title', 'mr').field('firstname', 'Justin').field('lastname', 'Ikwuoma').field('username', 'justman').field('password', 'abc').field('email', 'justin@gmail.com').field('gender', 'male').field('country', 'Nigeria').field('phone', '66979649').attach('userImage', '').end(function (err1, res1) {
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
        }).then(function (user) {
          Question.create({
            title: 'I wannna know',
            question: 'I wannna know your name',
            userId: user.rows[0].id,
            tags: 'java,javascript',
            questionImage: 'hhhhjjh'
          }).then(function (question) {
            request.delete('/v1/questions/' + question.rows[0].id).set('x-access-token', res1.body.token).end(function (err, res) {
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
    it('it should DELETE a queston and its file given the id', function (done) {
      request.post('/auth/v1/signup').field('title', 'mr').field('firstname', 'Justin').field('lastname', 'Ikwuoma').field('username', 'justman').field('password', 'abc').field('email', 'justin@gmail.com').field('gender', 'male').field('country', 'Nigeria').field('phone', '66979649').attach('userImage', '').end(function (err1, res1) {
        request.post('/v1/questions').set('x-access-token', res1.body.token).field('title', 'How far na').field('question', 'I just wan no how u dey').field('tags', 'java,javascript').attach('questionImage', './testFile.png').end(function (err2, res2) {
          request.delete('/v1/questions/' + res2.body.id).set('x-access-token', res1.body.token).end(function (err, res) {
            res.should.have.status(204);
            res.body.should.be.a('object');
            done();
          });
        });
      });
    });
  });
});
/* eslint-enable no-console */
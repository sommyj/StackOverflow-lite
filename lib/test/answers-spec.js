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
var _ref3 = [_models2.default.Answer],
    Answer = _ref3[0];
// Delete file helper method

var _ref4 = [_filebaseStorage2.default.deleteImageFromStorage],
    deleteImageFromStorage = _ref4[0];


describe('Answers', function () {
  beforeEach(function (done) {
    // Before each test we empty the database
    User.destroy({ where: {}, force: true });
    Question.destroy({ where: {}, force: true });
    Answer.destroy({ where: {}, force: true }).then(function () {
      return done();
    });
  });

  describe('/POST answer', function () {
    it('it should not CREATE an answer without response', function (done) {
      request.post('/auth/v1/signup').field('title', 'mr').field('firstname', 'Justin').field('lastname', 'Ikwuoma').field('username', 'justman').field('password', 'abc').field('email', 'justin@gmail.com').field('gender', 'male').field('country', 'Nigeria').field('phone', '66979649').attach('userImage', '').end(function (err1, res1) {
        request.post('/v1/questions').set('x-access-token', res1.body.token).field('title', 'How far na').field('question', 'I just wan no how u dey').field('tags', 'java,javascript').attach('questionImage', '').end(function (err2, res2) {
          request.post('/v1/questions/' + res2.body.id + '/answers').set('x-access-token', res1.body.token).field('response', '').attach('answerImage', '').end(function (err, res) {
            res.should.have.status(206);
            res.body.should.be.a('object');
            res.body.should.have.property('message').eql('Incomplete field');

            done();
          });
        });
      });
    });
    it('it should CREATE an answer', function (done) {
      request.post('/auth/v1/signup').field('title', 'mr').field('firstname', 'Justin').field('lastname', 'Ikwuoma').field('username', 'justman').field('password', 'abc').field('email', 'justin@gmail.com').field('gender', 'male').field('country', 'Nigeria').field('phone', '66979649').attach('userImage', '').end(function (err1, res1) {
        request.post('/v1/questions').set('x-access-token', res1.body.token).field('title', 'How far na').field('question', 'I just wan no how u dey').field('tags', 'java,javascript').attach('questionImage', '').end(function (err2, res2) {
          request.post('/v1/questions/' + res2.body.id + '/answers').set('x-access-token', res1.body.token).field('response', 'very fine').attach('answerImage', './testFile.png').end(function () {
            var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(err, res) {
              return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                  switch (_context.prev = _context.next) {
                    case 0:
                      res.should.have.status(201);
                      res.body.should.be.a('object');
                      res.body.should.have.property('response').eql('very fine');
                      res.body.should.have.property('userid').eql(res1.body.user.id);
                      res.body.should.have.property('accepted').eql(false);
                      res.body.should.have.property('vote').eql(0);
                      res.body.should.have.property('answerimage').eql(res.body.answerimage);

                      // delete test image file

                      if (!res.body.answerimage) {
                        _context.next = 16;
                        break;
                      }

                      _context.prev = 8;
                      _context.next = 11;
                      return deleteImageFromStorage(res.body.answerimage);

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
              return _ref5.apply(this, arguments);
            };
          }());
        });
      });
    });
    it('it should CREATE an answer without image', function (done) {
      request.post('/auth/v1/signup').field('title', 'mr').field('firstname', 'Justin').field('lastname', 'Ikwuoma').field('username', 'justman').field('password', 'abc').field('email', 'justin@gmail.com').field('gender', 'male').field('country', 'Nigeria').field('phone', '66979649').attach('userImage', '').end(function (err1, res1) {
        request.post('/v1/questions').set('x-access-token', res1.body.token).field('title', 'How far na').field('question', 'I just wan no how u dey').field('tags', 'java,javascript').attach('questionImage', '').end(function (err2, res2) {
          request.post('/v1/questions/' + res2.body.id + '/answers').set('x-access-token', res1.body.token).field('response', 'very fine').attach('answerImage', '').end(function (err, res) {
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
    it('it should not CREATE an answer when image file type not jpg/png', function (done) {
      request.post('/auth/v1/signup').field('title', 'mr').field('firstname', 'Justin').field('lastname', 'Ikwuoma').field('username', 'justman').field('password', 'abc').field('email', 'justin@gmail.com').field('gender', 'male').field('country', 'Nigeria').field('phone', '66979649').attach('userImage', '').end(function (err1, res1) {
        request.post('/v1/questions').set('x-access-token', res1.body.token).field('title', 'How far na').field('question', 'I just wan no how u dey').field('tags', 'java,javascript').attach('questionImage', '').end(function (err2, res2) {
          request.post('/v1/questions/' + res2.body.id + '/answers').set('x-access-token', res1.body.token).field('response', 'very fine').attach('answerImage', './testFileType.txt').end(function (err, res) {
            res.should.have.status(403);
            res.body.should.be.a('object');
            res.body.should.have.property('message').eql('Only .png and .jpg files are allowed!');
            res.body.should.have.property('error').eql(true);

            done();
          });
        });
      });
    });
    it('it should not CREATE an answer when image file size is larger than 2mb', function (done) {
      request.post('/auth/v1/signup').field('title', 'mr').field('firstname', 'Justin').field('lastname', 'Ikwuoma').field('username', 'justman').field('password', 'abc').field('email', 'justin@gmail.com').field('gender', 'male').field('country', 'Nigeria').field('phone', '66979649').attach('userImage', '').end(function (err1, res1) {
        request.post('/v1/questions').set('x-access-token', res1.body.token).field('title', 'How far na').field('question', 'I just wan no how u dey').field('tags', 'java,javascript').attach('questionImage', '').end(function (err2, res2) {
          request.post('/v1/questions/' + res2.body.id + '/answers').set('x-access-token', res1.body.token).field('response', 'very fine').attach('answerImage', './testFileSize.jpg').end(function (err, res) {
            res.should.have.status(403);
            res.body.should.be.a('object');
            res.body.should.have.property('message').eql('file should not be more than 2mb!');
            res.body.should.have.property('error').eql(true);

            done();
          });
        });
      });
    });
    it('it should not CREATE an answer when a token is not provided', function (done) {
      request.post('/auth/v1/signup').field('title', 'mr').field('firstname', 'Justin').field('lastname', 'Ikwuoma').field('username', 'justman').field('password', 'abc').field('email', 'justin@gmail.com').field('gender', 'male').field('country', 'Nigeria').field('phone', '66979649').attach('userImage', '').end(function (err1, res1) {
        request.post('/v1/questions').set('x-access-token', res1.body.token).field('title', 'How far na').field('question', 'I just wan no how u dey').field('tags', 'java,javascript').attach('questionImage', '').end(function (err2, res2) {
          request.post('/v1/questions/' + res2.body.id + '/answers').field('response', 'very fine').attach('answerImage', './testFile.png').end(function (err, res) {
            res.should.have.status(401);
            res.body.should.be.a('object');
            res.body.should.have.property('auth').eql(false);
            res.body.should.have.property('message').eql('No token provided.');

            done();
          });
        });
      });
    });
    it('it should not CREATE an answer when it fails to authenticate token', function (done) {
      request.post('/auth/v1/signup').field('title', 'mr').field('firstname', 'Justin').field('lastname', 'Ikwuoma').field('username', 'justman').field('password', 'abc').field('email', 'justin@gmail.com').field('gender', 'male').field('country', 'Nigeria').field('phone', '66979649').attach('userImage', '').end(function (err1, res1) {
        request.post('/v1/questions').set('x-access-token', res1.body.token).field('title', 'How far na').field('question', 'I just wan no how u dey').field('tags', 'java,javascript').attach('questionImage', '').end(function (err2, res2) {
          request.post('/v1/questions/' + res2.body.id + '/answers').set('x-access-token', 'jdkjdfskjs43354mxxnzsdz.drfsff.srfsf35324').field('response', 'very fine').attach('answerImage', './testFile.png').end(function (err, res) {
            res.should.have.status(500);
            res.body.should.be.a('object');
            res.body.should.have.property('auth').eql(false);
            res.body.should.have.property('message').eql('Failed to authenticate token.');

            done();
          });
        });
      });
    });
    it('it should not CREATE an answer when user is delete but token exist', function (done) {
      request.post('/auth/v1/signup').field('title', 'mr').field('firstname', 'Justin').field('lastname', 'Ikwuoma').field('username', 'justman').field('password', 'abc').field('email', 'justin@gmail.com').field('gender', 'male').field('country', 'Nigeria').field('phone', '66979649').attach('userImage', '').end(function (err1, res1) {
        request.post('/v1/questions').set('x-access-token', res1.body.token).field('title', 'How far na').field('question', 'I just wan no how u dey').field('tags', 'java,javascript').attach('questionImage', '').end(function (err2, res2) {
          User.destroy({ where: { id: res1.body.user.id } }).then(function () {
            request.post('/v1/questions/' + res2.body.id + '/answers').set('x-access-token', res1.body.token).field('response', 'very fine').attach('answerImage', './testFile.png').end(function (err, res) {
              res.should.have.status(400);
              res.body.should.be.a('object');
              res.body.should.have.property('message').eql('user has been removed from the database');
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
  describe('/PUT/:id answer', function () {
    it('it should UPDATE an answer given the answer id by the question author', function (done) {
      request.post('/auth/v1/signup').field('title', 'mr').field('firstname', 'Justin').field('lastname', 'Ikwuoma').field('username', 'justman').field('password', 'abc').field('email', 'justin@gmail.com').field('gender', 'male').field('country', 'Nigeria').field('phone', '66979649').attach('userImage', '').end(function (err1, res1) {
        request.post('/v1/questions').set('x-access-token', res1.body.token).field('title', 'How far na').field('question', 'I just wan no how u dey').field('tags', 'java,javascript').attach('questionImage', '').end(function (err2, res2) {
          request.post('/v1/questions/' + res2.body.id + '/answers').set('x-access-token', res1.body.token).field('response', 'very fine').attach('answerImage', '').end(function (err, res) {
            request.put('/v1/questions/' + res2.body.id + '/answers/' + res.body.id).set('x-access-token', res1.body.token).field('accepted', true).end(function (err, res) {
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

    it('it should UPDATE an answer given the answer id by the answer author', function (done) {
      request.post('/auth/v1/signup').field('title', 'mr').field('firstname', 'Justin').field('lastname', 'Ikwuoma').field('username', 'justman').field('password', 'abc').field('email', 'justin@gmail.com').field('gender', 'male').field('country', 'Nigeria').field('phone', '66979649').attach('userImage', '').end(function (err1, res1) {
        request.post('/v1/questions').set('x-access-token', res1.body.token).field('title', 'How far na').field('question', 'I just wan no how u dey').field('tags', 'java,javascript').attach('questionImage', '').end(function (err2, res2) {
          request.post('/v1/questions/' + res2.body.id + '/answers').set('x-access-token', res1.body.token).field('response', 'very fine').attach('answerImage', '').end(function (err, res) {
            request.put('/v1/questions/' + res2.body.id + '/answers/' + res.body.id).set('x-access-token', res1.body.token).field('response', 'i am ok').attach('answerImage', './testFile.png').end(function () {
              var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(err, res) {
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                  while (1) {
                    switch (_context2.prev = _context2.next) {
                      case 0:
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('response').eql('i am ok');
                        res.body.should.have.property('userid').eql(res1.body.user.id);
                        res.body.should.have.property('accepted').eql(false);
                        res.body.should.have.property('vote').eql(0);
                        res.body.should.have.property('answerimage').eql(res.body.answerimage);

                        // delete test image file

                        if (!res.body.answerimage) {
                          _context2.next = 16;
                          break;
                        }

                        _context2.prev = 8;
                        _context2.next = 11;
                        return deleteImageFromStorage(res.body.answerimage);

                      case 11:
                        _context2.next = 16;
                        break;

                      case 13:
                        _context2.prev = 13;
                        _context2.t0 = _context2['catch'](8);

                        console.error(_context2.t0);

                      case 16:

                        done();

                      case 17:
                      case 'end':
                        return _context2.stop();
                    }
                  }
                }, _callee2, undefined, [[8, 13]]);
              }));

              return function (_x3, _x4) {
                return _ref6.apply(this, arguments);
              };
            }());
          });
        });
      });
    });
    it('it should not UPDATE an answer given the wrong answer id', function (done) {
      request.post('/auth/v1/signup').field('title', 'mr').field('firstname', 'Justin').field('lastname', 'Ikwuoma').field('username', 'justman').field('password', 'abc').field('email', 'justin@gmail.com').field('gender', 'male').field('country', 'Nigeria').field('phone', '66979649').attach('userImage', '').end(function (err1, res1) {
        request.post('/v1/questions').set('x-access-token', res1.body.token).field('title', 'How far na').field('question', 'I just wan no how u dey').field('tags', 'java,javascript').attach('questionImage', '').end(function (err2, res2) {
          request.post('/v1/questions/' + res2.body.id + '/answers').set('x-access-token', res1.body.token).field('response', 'very fine').attach('answerImage', '').end(function () {
            request.put('/v1/questions/' + res2.body.id + '/answers/-1').set('x-access-token', res1.body.token).field('response', 'i am ok').attach('answerImage', './testFile.png').end(function (err, res) {
              res.should.have.status(404);
              res.body.should.be.a('object');
              res.body.should.have.property('message').eql('answer not found');

              done();
            });
          });
        });
      });
    });
    it('it should not UPDATE an answer given the wrong question id', function (done) {
      request.post('/auth/v1/signup').field('title', 'mr').field('firstname', 'Justin').field('lastname', 'Ikwuoma').field('username', 'justman').field('password', 'abc').field('email', 'justin@gmail.com').field('gender', 'male').field('country', 'Nigeria').field('phone', '66979649').attach('userImage', '').end(function (err1, res1) {
        request.post('/v1/questions').set('x-access-token', res1.body.token).field('title', 'How far na').field('question', 'I just wan no how u dey').field('tags', 'java,javascript').attach('questionImage', '').end(function (err2, res2) {
          request.post('/v1/questions/' + res2.body.id + '/answers').set('x-access-token', res1.body.token).field('response', 'very fine').attach('answerImage', '').end(function (err, res) {
            request.put('/v1/questions/-1/answers/' + res.body.id).set('x-access-token', res1.body.token).field('response', 'i am ok').attach('answerImage', './testFile.png').end(function (err, res) {
              res.should.have.status(404);
              res.body.should.be.a('object');
              res.body.should.have.property('message').eql('question not found');

              done();
            });
          });
        });
      });
    });
    it('it should UPDATE an answer given the id and\n    maintain already existing fields and file if none is entered', function (done) {
      request.post('/auth/v1/signup').field('title', 'mr').field('firstname', 'Justin').field('lastname', 'Ikwuoma').field('username', 'justman').field('password', 'abc').field('email', 'justin@gmail.com').field('gender', 'male').field('country', 'Nigeria').field('phone', '66979649').attach('userImage', '').end(function (err1, res1) {
        request.post('/v1/questions').set('x-access-token', res1.body.token).field('title', 'How far na').field('question', 'I just wan no how u dey').field('tags', 'java,javascript').attach('questionImage', '').end(function (err2, res2) {
          request.post('/v1/questions/' + res2.body.id + '/answers').set('x-access-token', res1.body.token).field('response', 'very fine').attach('answerImage', './testFile.png').end(function (err, res) {
            request.put('/v1/questions/' + res2.body.id + '/answers/' + res.body.id).set('x-access-token', res1.body.token).field('response', '').attach('answerImage', '').end(function () {
              var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(err, res) {
                return regeneratorRuntime.wrap(function _callee3$(_context3) {
                  while (1) {
                    switch (_context3.prev = _context3.next) {
                      case 0:
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('response').eql('very fine');
                        res.body.should.have.property('userid').eql(res1.body.user.id);
                        res.body.should.have.property('accepted').eql(false);
                        res.body.should.have.property('vote').eql(0);
                        res.body.should.have.property('answerimage').eql(res.body.answerimage);

                        // delete test image file

                        if (!res.body.answerimage) {
                          _context3.next = 16;
                          break;
                        }

                        _context3.prev = 8;
                        _context3.next = 11;
                        return deleteImageFromStorage(res.body.answerimage);

                      case 11:
                        _context3.next = 16;
                        break;

                      case 13:
                        _context3.prev = 13;
                        _context3.t0 = _context3['catch'](8);

                        console.error(_context3.t0);

                      case 16:
                        done();

                      case 17:
                      case 'end':
                        return _context3.stop();
                    }
                  }
                }, _callee3, undefined, [[8, 13]]);
              }));

              return function (_x5, _x6) {
                return _ref7.apply(this, arguments);
              };
            }());
          });
        });
      });
    });
    it('it should UPDATE a answer given the id and replace already existing file', function (done) {
      request.post('/auth/v1/signup').field('title', 'mr').field('firstname', 'Justin').field('lastname', 'Ikwuoma').field('username', 'justman').field('password', 'abc').field('email', 'justin@gmail.com').field('gender', 'male').field('country', 'Nigeria').field('phone', '66979649').attach('userImage', '').end(function (err1, res1) {
        request.post('/v1/questions').set('x-access-token', res1.body.token).field('title', 'How far na').field('question', 'I just wan no how u dey').field('tags', 'java,javascript').attach('questionImage', '').end(function (err2, res2) {
          request.post('/v1/questions/' + res2.body.id + '/answers').set('x-access-token', res1.body.token).field('response', 'very fine').attach('answerImage', './testFile.png').end(function (err, res) {
            request.put('/v1/questions/' + res2.body.id + '/answers/' + res.body.id).set('x-access-token', res1.body.token).field('response', '').attach('answerImage', './testFile.png').end(function () {
              var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(err, res) {
                return regeneratorRuntime.wrap(function _callee4$(_context4) {
                  while (1) {
                    switch (_context4.prev = _context4.next) {
                      case 0:
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('response').eql('very fine');
                        res.body.should.have.property('userid').eql(res1.body.user.id);
                        res.body.should.have.property('accepted').eql(false);
                        res.body.should.have.property('vote').eql(0);
                        res.body.should.have.property('answerimage').eql(res.body.answerimage);

                        // delete test image file

                        if (!res.body.answerimage) {
                          _context4.next = 16;
                          break;
                        }

                        _context4.prev = 8;
                        _context4.next = 11;
                        return deleteImageFromStorage(res.body.answerimage);

                      case 11:
                        _context4.next = 16;
                        break;

                      case 13:
                        _context4.prev = 13;
                        _context4.t0 = _context4['catch'](8);

                        console.error(_context4.t0);

                      case 16:
                        done();

                      case 17:
                      case 'end':
                        return _context4.stop();
                    }
                  }
                }, _callee4, undefined, [[8, 13]]);
              }));

              return function (_x7, _x8) {
                return _ref8.apply(this, arguments);
              };
            }());
          });
        });
      });
    });
    it('it should not UPDATE an answer when image file type not jpg/png', function (done) {
      request.post('/auth/v1/signup').field('title', 'mr').field('firstname', 'Justin').field('lastname', 'Ikwuoma').field('username', 'justman').field('password', 'abc').field('email', 'justin@gmail.com').field('gender', 'male').field('country', 'Nigeria').field('phone', '66979649').attach('userImage', '').end(function (err1, res1) {
        request.post('/v1/questions').set('x-access-token', res1.body.token).field('title', 'How far na').field('question', 'I just wan no how u dey').field('tags', 'java,javascript').attach('questionImage', '').end(function (err2, res2) {
          request.post('/v1/questions/' + res2.body.id + '/answers').set('x-access-token', res1.body.token).field('response', 'very fine').attach('answerImage', '').end(function (err, res) {
            request.put('/v1/questions/' + res2.body.id + '/answers/' + res.body.id).set('x-access-token', res1.body.token).field('response', '').attach('answerImage', './testFileType.txt').end(function (err, res) {
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
    it('it should not UPDATE a answer\n    when image file size is larger than 2mb', function (done) {
      request.post('/auth/v1/signup').field('title', 'mr').field('firstname', 'Justin').field('lastname', 'Ikwuoma').field('username', 'justman').field('password', 'abc').field('email', 'justin@gmail.com').field('gender', 'male').field('country', 'Nigeria').field('phone', '66979649').attach('userImage', '').end(function (err1, res1) {
        request.post('/v1/questions').set('x-access-token', res1.body.token).field('title', 'How far na').field('question', 'I just wan no how u dey').field('tags', 'java,javascript').attach('questionImage', '').end(function (err2, res2) {
          request.post('/v1/questions/' + res2.body.id + '/answers').set('x-access-token', res1.body.token).field('response', 'very fine').attach('answerImage', '').end(function (err, res) {
            request.put('/v1/questions/' + res2.body.id + '/answers/' + res.body.id).set('x-access-token', res1.body.token).field('response', '').attach('answerImage', './testFileSize.jpg').end(function (err, res) {
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
    it('it should not UPDATE an answer when a token is not provided', function (done) {
      request.post('/auth/v1/signup').field('title', 'mr').field('firstname', 'Justin').field('lastname', 'Ikwuoma').field('username', 'justman').field('password', 'abc').field('email', 'justin@gmail.com').field('gender', 'male').field('country', 'Nigeria').field('phone', '66979649').attach('userImage', '').end(function (err1, res1) {
        request.post('/v1/questions').set('x-access-token', res1.body.token).field('title', 'How far na').field('question', 'I just wan no how u dey').field('tags', 'java,javascript').attach('questionImage', '').end(function (err2, res2) {
          request.post('/v1/questions/' + res2.body.id + '/answers').set('x-access-token', res1.body.token).field('response', 'very fine').attach('answerImage', '').end(function (err, res) {
            request.put('/v1/questions/' + res2.body.id + '/answers/' + res.body.id).field('response', '').attach('answerImage', '').end(function (err, res) {
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
    it('it should not UPDATE a answer when it fails to authenticate token.', function (done) {
      request.post('/auth/v1/signup').field('title', 'mr').field('firstname', 'Justin').field('lastname', 'Ikwuoma').field('username', 'justman').field('password', 'abc').field('email', 'justin@gmail.com').field('gender', 'male').field('country', 'Nigeria').field('phone', '66979649').attach('userImage', '').end(function (err1, res1) {
        request.post('/v1/questions').set('x-access-token', res1.body.token).field('title', 'How far na').field('question', 'I just wan no how u dey').field('tags', 'java,javascript').attach('questionImage', '').end(function (err2, res2) {
          request.post('/v1/questions/' + res2.body.id + '/answers').set('x-access-token', res1.body.token).field('response', 'very fine').attach('answerImage', '').end(function (err, res) {
            request.put('/v1/questions/' + res2.body.id + '/answers/' + res.body.id).set('x-access-token', 'nmdhnjf.njfjfj.fkfkfk').field('response', '').attach('answerImage', '').end(function (err, res) {
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
    it('it should not UPDATE a answer when user is unauthorize.', function (done) {
      request.post('/auth/v1/signup').field('title', 'mr').field('firstname', 'Justin').field('lastname', 'Ikwuoma').field('username', 'justman').field('password', 'abc').field('email', 'justin@gmail.com').field('gender', 'male').field('country', 'Nigeria').field('phone', '66979649').attach('userImage', '').end(function (err1, res1) {
        request.post('/v1/questions').set('x-access-token', res1.body.token).field('title', 'How far na').field('question', 'I just wan no how u dey').field('tags', 'java,javascript').attach('questionImage', '').end(function (err2, res2) {
          Answer.create({ response: 'very fine', answerImage: '' }).then(function (answer) {
            request.put('/v1/questions/' + res2.body.id + '/answers/' + answer.rows[0].id).set('x-access-token', res1.body.token).field('response', '').attach('answerImage', '').end(function (err, res) {
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
/* eslint-enable no-console */
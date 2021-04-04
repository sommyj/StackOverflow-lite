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
// Delete file helper method

var _ref2 = [_filebaseStorage2.default.deleteImageFromStorage],
    deleteImageFromStorage = _ref2[0];


describe('Users', function () {
  beforeEach(function (done) {
    // Before each test we empty the database
    User.destroy({ where: {}, force: true }).then(function () {
      return done();
    });
  });

  describe('/POST user', function () {
    it('it should not CREATE a user without username, password,\n     email, gender', function (done) {
      request.post('/auth/v1/signup').field('title', 'mr').field('firstname', '').field('lastname', '').field('username', '').field('password', '').field('email', '').field('gender', '').field('country', '').field('phone', '').attach('userImage', './testFile.png').end(function (err, res) {
        res.should.have.status(206);
        res.body.should.be.a('object');
        res.body.should.have.property('message').eql('Incomplete field');
        done();
      });
    });

    it('it should CREATE a user', function (done) {
      request.post('/auth/v1/signup').field('title', 'mr').field('firstname', 'Justin').field('lastname', 'Ikwuoma').field('username', 'justman').field('password', 'abc').field('email', 'justin@gmail.com').field('gender', 'male').field('country', 'Nigeria').field('phone', '66976498').attach('userImage', './testFile.png').end(function () {
        var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(err, res) {
          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  res.should.have.status(201);
                  res.body.should.be.a('object');
                  res.body.user.should.have.property('id').eql(res.body.user.id);
                  res.body.user.should.have.property('firstname').eql('Justin');
                  res.body.user.should.have.property('lastname').eql('Ikwuoma');
                  res.body.user.should.have.property('username').eql('justman');
                  res.body.user.should.have.property('email').eql('justin@gmail.com');
                  res.body.user.should.have.property('password').eql(res.body.user.password);
                  res.body.user.should.have.property('gender').eql('male');
                  res.body.user.should.have.property('country').eql('Nigeria');
                  res.body.user.should.have.property('userimage').eql(res.body.user.userimage);
                  res.body.should.have.property('auth').eql(true);
                  res.body.should.have.property('token').eql(res.body.token);

                  // delete test image file

                  if (!res.body.user.userimage) {
                    _context.next = 22;
                    break;
                  }

                  _context.prev = 14;
                  _context.next = 17;
                  return deleteImageFromStorage(res.body.user.userimage);

                case 17:
                  _context.next = 22;
                  break;

                case 19:
                  _context.prev = 19;
                  _context.t0 = _context['catch'](14);

                  console.error(_context.t0);

                case 22:
                  done();

                case 23:
                case 'end':
                  return _context.stop();
              }
            }
          }, _callee, undefined, [[14, 19]]);
        }));

        return function (_x, _x2) {
          return _ref3.apply(this, arguments);
        };
      }());
    });

    it('it should CREATE a user without image', function (done) {
      request.post('/auth/v1/signup').field('title', 'mr').field('firstname', 'Justin').field('lastname', 'Ikwuoma').field('username', 'justman1').field('password', 'abc').field('email', 'justin1@gmail.com').field('gender', 'male').field('country', 'Nigeria').field('phone', '669796498').attach('userImage', '').end(function (err, res) {
        res.should.have.status(201);
        res.body.should.be.a('object');
        res.body.user.should.have.property('id').eql(res.body.user.id);
        res.body.user.should.have.property('firstname').eql('Justin');
        res.body.user.should.have.property('lastname').eql('Ikwuoma');
        res.body.user.should.have.property('username').eql('justman1');
        res.body.user.should.have.property('email').eql('justin1@gmail.com');
        res.body.user.should.have.property('password').eql(res.body.user.password);
        res.body.user.should.have.property('gender').eql('male');
        res.body.user.should.have.property('country').eql('Nigeria');
        res.body.user.should.have.property('userimage').eql('');
        res.body.should.have.property('auth').eql(true);
        res.body.should.have.property('token').eql(res.body.token);

        done();
      });
    });

    it('it should not CREATE a user when image file type not jpg/png', function (done) {
      request.post('/auth/v1/signup').field('title', 'mr').field('firstname', 'Justin').field('lastname', 'Ikwuoma').field('username', 'justman2').field('password', 'abc').field('email', 'justin2@gmail.com').field('gender', 'male').field('country', 'Nigeria').field('dob', '2015-11-04').attach('userImage', './testFileType.txt').end(function (err, res) {
        res.should.have.status(403);
        res.body.should.be.a('object');
        res.body.should.have.property('message').eql('Only .png and .jpg files are allowed!');
        res.body.should.have.property('error').eql(true);
        done();
      });
    });

    it('it should not CREATE a user\n      when image file size is larger than 2mb', function (done) {
      request.post('/auth/v1/signup').field('title', 'mr').field('firstname', 'Justin').field('lastname', 'Ikwuoma').field('username', 'justman3').field('password', 'abc').field('email', 'justin3@gmail.com').field('gender', 'male').field('country', 'Nigeria').field('phone', '366976498').attach('userImage', './testFileSize.jpg').end(function (err, res) {
        res.should.have.status(403);
        res.body.should.be.a('object');
        res.body.should.have.property('message').eql('file should not be more than 2mb!');
        res.body.should.have.property('error').eql(true);
        done();
      });
    });

    it('it should not CREATE a user if username already exist', function (done) {
      User.create({
        title: 'mr',
        firstname: 'Justin',
        lastname: 'Ikwuoma',
        username: 'justman4',
        password: 'abc',
        email: 'justin4@gmail.com',
        gender: 'male',
        country: 'Nigeria',
        phone: '4466976498',
        userImage: ''
      }).then(function () {
        request.post('/auth/v1/signup').field('title', 'mr').field('firstname', 'Justin').field('lastname', 'Ikwuoma').field('username', 'justman4').field('password', 'abc').field('email', 'justin1@gmail.com').field('gender', 'male').field('country', 'Nigeria').field('phone', '669796498').attach('userImage', '').end(function (err, res) {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('username already exists');
          done();
        });
      });
    });

    it('it should not CREATE a user if email already exist', function (done) {
      User.create({
        title: 'mr',
        firstname: 'Justin',
        lastname: 'Ikwuoma',
        username: 'justman4',
        password: 'abc',
        email: 'justin4@gmail.com',
        gender: 'male',
        country: 'Nigeria',
        phone: '4466976498',
        userImage: ''
      }).then(function () {
        request.post('/auth/v1/signup').field('title', 'mr').field('firstname', 'Justin1').field('lastname', 'Ikwuoma').field('username', 'justman4').field('password', 'abc').field('email', 'justin4@gmail.com').field('gender', 'male').field('country', 'Nigeria').field('phone', '669796498').attach('userImage', '').end(function (err, res) {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('username already exists');
          done();
        });
      });
    });

    it('it should not CREATE a user if phone already exist', function (done) {
      User.create({
        title: 'mr',
        firstname: 'Justin',
        lastname: 'Ikwuoma',
        username: 'justman4',
        password: 'abc',
        email: 'justin4@gmail.com',
        gender: 'male',
        country: 'Nigeria',
        phone: '669796498',
        userImage: ''
      }).then(function () {
        request.post('/auth/v1/signup').field('title', 'mr').field('firstname', 'Justin1').field('lastname', 'Ikwuoma').field('username', 'justman4').field('password', 'abc').field('email', 'justin@gmail.com').field('gender', 'male').field('country', 'Nigeria').field('phone', '669796498').attach('userImage', '').end(function (err, res) {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('username already exists');
          done();
        });
      });
    });

    it('it should not get a particular user if POST a wrong username', function (done) {
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
      }).then(function () {
        request.post('/auth/v1/login').send({ username: 'just', password: 'abc' }).end(function (err, res) {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.message.should.be.eql('Invalid username/password');
          done();
        });
      });
    });

    it('it should not get a particular user if POST a wrong username', function (done) {
      request.post('/auth/v1/signup').field('title', 'mr').field('firstname', 'Justin').field('lastname', 'Ikwuoma').field('username', 'justman4').field('password', 'abc').field('email', 'justin@gmail.com').field('gender', 'male').field('country', 'Nigeria').field('phone', '669796498').attach('userImage', '').end(function () {
        request.post('/auth/v1/login').send({ username: 'just', password: 'abc' }).end(function (err, res) {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.message.should.be.eql('Invalid username/password');
          done();
        });
      });
    });

    it('it should POST username && password and get the particular user', function (done) {
      request.post('/auth/v1/signup').field('title', 'mr').field('firstname', 'Justin').field('lastname', 'Ikwuoma').field('username', 'justman4').field('password', 'abc').field('email', 'justin@gmail.com').field('gender', 'male').field('country', 'Nigeria').field('phone', '669796498').attach('userImage', '').end(function () {
        request.post('/auth/v1/login').send({ username: 'justman4', password: 'abc' }).end(function (err, res) {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.user.should.have.property('id');
          res.body.user.should.have.property('firstname').eql('Justin');
          res.body.user.should.have.property('lastname').eql('Ikwuoma');
          res.body.user.should.have.property('username').eql('justman4');
          res.body.user.should.have.property('email').eql('justin@gmail.com');
          res.body.user.should.have.property('password').eql(res.body.user.password);
          res.body.user.should.have.property('userimage').eql('');
          res.body.should.have.property('auth').eql(true);
          res.body.should.have.property('token').eql(res.body.token);
          done();
        });
      });
    });
  });
});
/* eslint-enable no-console */
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _multer = require('multer');

var _multer2 = _interopRequireDefault(_multer);

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _bcryptjs = require('bcryptjs');

var _bcryptjs2 = _interopRequireDefault(_bcryptjs);

var _models = require('../models');

var _models2 = _interopRequireDefault(_models);

var _app = require('../../app');

var _app2 = _interopRequireDefault(_app);

var _errorHandler = require('./utilities/errorHandler');

var _errorHandler2 = _interopRequireDefault(_errorHandler);

var _fileFilter = require('./utilities/fileFilter');

var _fileFilter2 = _interopRequireDefault(_fileFilter);

var _filebaseStorage = require('./utilities/filebaseStorage');

var _filebaseStorage2 = _interopRequireDefault(_filebaseStorage);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; } /*  eslint import/no-cycle: [2, { maxDepth: 1 }]  */
/* eslint-disable no-restricted-syntax */


var _ref = [_models2.default.User],
    User = _ref[0];
var _ref2 = [_filebaseStorage2.default.uploadImageToStorage],
    uploadImageToStorage = _ref2[0];
var _ref3 = [_errorHandler2.default.createHandlerError],
    createHandlerError = _ref3[0]; // create handleError
// incomplete field handleError

var _ref4 = [_errorHandler2.default.incompleteFieldHandlerError],
    incompleteFieldHandlerError = _ref4[0];
var _ref5 = [_errorHandler2.default.fileHandleError],
    fileHandleError = _ref5[0]; // file handleError

var _ref6 = [_errorHandler2.default.usernameHandlerError],
    usernameHandlerError = _ref6[0]; // username handleError

var _ref7 = [_errorHandler2.default.emailHandlerError],
    emailHandlerError = _ref7[0]; // email handleError

var _ref8 = [_errorHandler2.default.phoneHandlerError],
    phoneHandlerError = _ref8[0]; // phone handleError

var upload = (0, _multer2.default)({
  storage: _multer2.default.memoryStorage()
});

var fileSizeLimit = 1024 * 1024 * 2;

// Token creation hanlder method
var tokenMethod = function tokenMethod(userId) {
  var token = _jsonwebtoken2.default.sign({ id: userId }, _app2.default.get('superSecret'), { expiresIn: 86400 } // expires in 24 hours
  );
  return token;
};

var usersController = {
  upload: upload.single('userImage'), // image upload
  create: function create(req, res) {
    var _this = this;

    // create a user
    /* Required feilds */
    if (!req.body.username || !req.body.password || !req.body.email || !req.body.gender) {
      return incompleteFieldHandlerError(res);
    }
    // Auto-gen a salt and hash
    var hashedPassword = _bcryptjs2.default.hashSync(req.body.password, 8);

    var _ref9 = [req.file],
        file = _ref9[0];

    var fileName = '';

    /* Search to see if username, email and phone exist before creation
    to avoid skipping of id on unique constraint */
    User.findAll().then(function () {
      var _ref10 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(results) {
        var users, userCount, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, user, fileError, data;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                users = results.rows;
                userCount = 0;
                _iteratorNormalCompletion = true;
                _didIteratorError = false;
                _iteratorError = undefined;
                _context.prev = 5;
                _iterator = users[Symbol.iterator]();

              case 7:
                if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                  _context.next = 19;
                  break;
                }

                user = _step.value;

                if (!(req.body.username === user.username)) {
                  _context.next = 11;
                  break;
                }

                return _context.abrupt('return', usernameHandlerError(res));

              case 11:
                if (!(req.body.email === user.email)) {
                  _context.next = 13;
                  break;
                }

                return _context.abrupt('return', emailHandlerError(res));

              case 13:
                if (!(req.body.phone === user.phone)) {
                  _context.next = 15;
                  break;
                }

                return _context.abrupt('return', phoneHandlerError(res));

              case 15:
                userCount += 1;

              case 16:
                _iteratorNormalCompletion = true;
                _context.next = 7;
                break;

              case 19:
                _context.next = 25;
                break;

              case 21:
                _context.prev = 21;
                _context.t0 = _context['catch'](5);
                _didIteratorError = true;
                _iteratorError = _context.t0;

              case 25:
                _context.prev = 25;
                _context.prev = 26;

                if (!_iteratorNormalCompletion && _iterator.return) {
                  _iterator.return();
                }

              case 28:
                _context.prev = 28;

                if (!_didIteratorError) {
                  _context.next = 31;
                  break;
                }

                throw _iteratorError;

              case 31:
                return _context.finish(28);

              case 32:
                return _context.finish(25);

              case 33:
                if (!(userCount === users.length)) {
                  _context.next = 49;
                  break;
                }

                if (!file) {
                  _context.next = 47;
                  break;
                }

                // implementing the file filter method
                fileError = (0, _fileFilter2.default)(req, fileSizeLimit);

                if (!fileError) {
                  _context.next = 38;
                  break;
                }

                return _context.abrupt('return', fileHandleError(res, fileError));

              case 38:
                _context.prev = 38;
                _context.next = 41;
                return uploadImageToStorage(file, 'userImages');

              case 41:
                fileName = _context.sent;
                _context.next = 47;
                break;

              case 44:
                _context.prev = 44;
                _context.t1 = _context['catch'](38);
                return _context.abrupt('return', res.status(400).send(_context.t1));

              case 47:

                // Grab data from http request
                data = {
                  title: req.body.title,
                  firstname: req.body.firstname,
                  lastname: req.body.lastname,
                  username: req.body.username,
                  password: hashedPassword,
                  email: req.body.email,
                  gender: req.body.gender,
                  country: req.body.country,
                  phone: req.body.phone,
                  userImage: fileName
                };


                User.create(data) // pass data to our model
                .then(function (result) {
                  var user = result.rows[0];
                  var token = tokenMethod(user.id); // Generate token
                  if (token) return res.status(201).send({ user: user, auth: true, token: token });
                }).catch(function (error) {
                  return createHandlerError(error, res, fileName);
                });

              case 49:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, _this, [[5, 21, 25, 33], [26,, 28, 32], [38, 44]]);
      }));

      return function (_x) {
        return _ref10.apply(this, arguments);
      };
    }()).catch(function (error) {
      return createHandlerError(error, res);
    });
  },
  check: function check(req, res) {
    // login with username and password
    // pass data to our model
    User.findOne({ where: { username: req.body.username } }).then(function (result) {
      var user = result.rows[0];
      // Returning error message for user not found
      if (!user) return res.status(400).send({ message: 'Invalid username/password' });
      // Compare hash from your password DB.
      var passIsEqual = _bcryptjs2.default.compareSync(req.body.password, user.password);
      if (!passIsEqual) return res.status(404).send({ message: 'Invalid username/password' });
      var token = tokenMethod(user.id); // Generate token
      // Returning user detais
      if (token) return res.status(200).send({ user: user, auth: true, token: token });
    }).catch(function (e) {
      return res.status(400).send(e);
    });
  }
};

exports.default = usersController;
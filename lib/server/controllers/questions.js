'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _multer = require('multer');

var _multer2 = _interopRequireDefault(_multer);

var _models = require('../models');

var _models2 = _interopRequireDefault(_models);

var _errorHandler = require('./utilities/errorHandler');

var _errorHandler2 = _interopRequireDefault(_errorHandler);

var _fileFilter = require('./utilities/fileFilter');

var _fileFilter2 = _interopRequireDefault(_fileFilter);

var _authHandler = require('./utilities/authHandler');

var _authHandler2 = _interopRequireDefault(_authHandler);

var _filebaseStorage = require('./utilities/filebaseStorage');

var _filebaseStorage2 = _interopRequireDefault(_filebaseStorage);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; } /*  eslint import/no-cycle: [2, { maxDepth: 1 }]  */
/* eslint-disable no-restricted-syntax */


var _ref = [_models2.default.Question],
    Question = _ref[0];
var _ref2 = [_models2.default.Answer],
    Answer = _ref2[0];
var _ref3 = [_filebaseStorage2.default.uploadImageToStorage],
    uploadImageToStorage = _ref3[0];
var _ref4 = [_filebaseStorage2.default.deleteImageFromStorage],
    deleteImageFromStorage = _ref4[0];
var _ref5 = [_filebaseStorage2.default.getImageFromStorage],
    getImageFromStorage = _ref5[0];
var _ref6 = [_errorHandler2.default.createHandlerError],
    createHandlerError = _ref6[0]; // create handleError
// incomplete field handleError

var _ref7 = [_errorHandler2.default.incompleteFieldHandlerError],
    incompleteFieldHandlerError = _ref7[0];
var _ref8 = [_errorHandler2.default.fileHandleError],
    fileHandleError = _ref8[0]; // file handleError

var _ref9 = [_errorHandler2.default.questionHandlerError],
    questionHandlerError = _ref9[0]; // question handleError
// user deleted handleError

var _ref10 = [_errorHandler2.default.userNotPrestentHandlerError],
    userNotPrestentHandlerError = _ref10[0];
var _ref11 = [_errorHandler2.default.noTokenHandlerError],
    noTokenHandlerError = _ref11[0]; // no token provided handleError
// failed Authentication handlerError

var _ref12 = [_errorHandler2.default.failedAuthHandlerError],
    failedAuthHandlerError = _ref12[0];
// parameters handlerError

var _ref13 = [_errorHandler2.default.parametersHandlerError],
    parametersHandlerError = _ref13[0];


var upload = (0, _multer2.default)({
  storage: _multer2.default.memoryStorage()
});

var fileSizeLimit = 1024 * 1024 * 2;

var questionsController = {
  upload: upload.single('questionImage'), // image upload
  create: function create(req, res) {
    var _this = this;

    // create a question
    var decodedID = void 0;
    var authValues = (0, _authHandler2.default)(req);
    var noTokenProviderError = authValues[0];
    var failedAuthError = authValues[1];
    var decodedIDFromMethod = authValues[2];

    if (noTokenProviderError) return noTokenHandlerError(res);
    if (failedAuthError) return failedAuthHandlerError(res);
    if (decodedIDFromMethod) decodedID = decodedIDFromMethod;

    /* Required feilds */
    if (!req.body.title || !req.body.question || !req.body.tags) {
      return incompleteFieldHandlerError(res);
    }

    var _ref14 = [req.file],
        file = _ref14[0];

    var fileName = '';
    /* Search to see if question title exist before creation
    to avoid skipping of id on unique constraint */
    Question.findAll().then(function () {
      var _ref15 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(results) {
        var questions, questionCount, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, question, fileError, data;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                questions = results.rows;
                questionCount = 0;
                _iteratorNormalCompletion = true;
                _didIteratorError = false;
                _iteratorError = undefined;
                _context.prev = 5;
                _iterator = questions[Symbol.iterator]();

              case 7:
                if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                  _context.next = 15;
                  break;
                }

                question = _step.value;

                if (!(req.body.title === question.title)) {
                  _context.next = 11;
                  break;
                }

                return _context.abrupt('return', questionHandlerError(res));

              case 11:
                questionCount += 1;

              case 12:
                _iteratorNormalCompletion = true;
                _context.next = 7;
                break;

              case 15:
                _context.next = 21;
                break;

              case 17:
                _context.prev = 17;
                _context.t0 = _context['catch'](5);
                _didIteratorError = true;
                _iteratorError = _context.t0;

              case 21:
                _context.prev = 21;
                _context.prev = 22;

                if (!_iteratorNormalCompletion && _iterator.return) {
                  _iterator.return();
                }

              case 24:
                _context.prev = 24;

                if (!_didIteratorError) {
                  _context.next = 27;
                  break;
                }

                throw _iteratorError;

              case 27:
                return _context.finish(24);

              case 28:
                return _context.finish(21);

              case 29:
                if (!(questionCount === questions.length)) {
                  _context.next = 45;
                  break;
                }

                if (!file) {
                  _context.next = 43;
                  break;
                }

                // implementing the file filter method
                fileError = (0, _fileFilter2.default)(req, fileSizeLimit);

                if (!fileError) {
                  _context.next = 34;
                  break;
                }

                return _context.abrupt('return', fileHandleError(res, fileError));

              case 34:
                _context.prev = 34;
                _context.next = 37;
                return uploadImageToStorage(file, 'questionImages');

              case 37:
                fileName = _context.sent;
                _context.next = 43;
                break;

              case 40:
                _context.prev = 40;
                _context.t1 = _context['catch'](34);
                return _context.abrupt('return', res.status(400).send(_context.t1));

              case 43:

                // Grab data from http request
                data = {
                  title: req.body.title,
                  question: req.body.question,
                  userId: decodedID,
                  tags: req.body.tags,
                  questionImage: fileName
                };

                Question.create(data) // pass data to our model
                .then(function (result) {
                  var question = result.rows[0];
                  return res.status(201).send(question);
                }).catch(function (error) {
                  if (error.name === 'error' && error.constraint === 'questions_userid_fkey') {
                    return userNotPrestentHandlerError(res, fileName);
                  }
                  return createHandlerError(error, res, fileName);
                });

              case 45:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, _this, [[5, 17, 21, 29], [22,, 24, 28], [34, 40]]);
      }));

      return function (_x) {
        return _ref15.apply(this, arguments);
      };
    }()).catch(function (error) {
      return createHandlerError(error, res);
    });
  },
  list: function list(req, res) {
    var _this2 = this;

    var decodedID = void 0; // Identity gotten from jwt
    var auth = false; // Session authentication
    var authValues = (0, _authHandler2.default)(req);

    var noTokenProviderError = authValues[0];
    var failedAuthError = authValues[1];
    var decodedIDFromMethod = authValues[2];

    // Check if token is still valid
    if (noTokenProviderError) {
      auth = false;
    } else if (failedAuthError) auth = false;else auth = true;

    if (decodedIDFromMethod) decodedID = decodedIDFromMethod;

    var selectionType = void 0;
    if (req.query.userId) {
      selectionType = Question.findAll({ where: { userId: decodedID }, order: ['createdat', 'DESC'] });
    } else {
      selectionType = Question.findAll({ order: ['createdat', 'DESC'] });
    }
    selectionType.then(function () {
      var _ref16 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(results) {
        var questions, promises;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                questions = results.rows;
                promises = questions.map(function () {
                  var _ref17 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(question) {
                    var answer;
                    return regeneratorRuntime.wrap(function _callee2$(_context2) {
                      while (1) {
                        switch (_context2.prev = _context2.next) {
                          case 0:
                            _context2.prev = 0;
                            _context2.next = 3;
                            return Answer.findOne({ where: { questionid: question.id }, order: ['createdat', 'ASC'] });

                          case 3:
                            answer = _context2.sent;

                            question.answers = answer.rows;
                            _context2.next = 10;
                            break;

                          case 7:
                            _context2.prev = 7;
                            _context2.t0 = _context2['catch'](0);
                            return _context2.abrupt('return', res.status(400).send(_context2.t0));

                          case 10:
                          case 'end':
                            return _context2.stop();
                        }
                      }
                    }, _callee2, _this2, [[0, 7]]);
                  }));

                  return function (_x3) {
                    return _ref17.apply(this, arguments);
                  };
                }());
                _context3.next = 4;
                return Promise.all(promises);

              case 4:
                return _context3.abrupt('return', res.status(200).send({ questions: questions, auth: auth }));

              case 5:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, _this2);
      }));

      return function (_x2) {
        return _ref16.apply(this, arguments);
      };
    }()).catch(function (error) {
      return res.status(400).send(error);
    });
  },
  retrieve: function retrieve(req, res) {
    var _this3 = this;

    var decodedID = void 0; // Identity gotten from jwt
    var auth = false; // Session authentication
    var authValues = (0, _authHandler2.default)(req);

    var noTokenProviderError = authValues[0];
    var failedAuthError = authValues[1];
    var decodedIDFromMethod = authValues[2];

    // Check if token is still valid
    if (noTokenProviderError) {
      auth = false;
    } else if (failedAuthError) auth = false;else auth = true;

    if (decodedIDFromMethod) decodedID = decodedIDFromMethod;

    if (parametersHandlerError(req)) {
      return res.status(400).send({ message: 'question not found' });
    }

    Question.findById(req.params.questionId).then(function (result) {
      var question = result.rows[0];
      if (!question) return res.status(404).send({ message: 'question not found' });
      // Getting answers to the question
      Answer.findOne({ where: { questionid: question.id }, order: ['createdat', 'ASC'] }).then(function () {
        var _ref18 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(answer) {
          var imageResponse, promises;
          return regeneratorRuntime.wrap(function _callee5$(_context5) {
            while (1) {
              switch (_context5.prev = _context5.next) {
                case 0:
                  if (decodedID === question.userid) question.user = true;else question.user = false;
                  question.auth = auth;
                  question.answers = answer.rows;

                  if (!question.questionimage) {
                    _context5.next = 17;
                    break;
                  }

                  _context5.prev = 4;
                  _context5.next = 7;
                  return getImageFromStorage(question.questionimage);

                case 7:
                  imageResponse = _context5.sent;

                  question.questionimage = imageResponse.mediaLink;
                  _context5.next = 14;
                  break;

                case 11:
                  _context5.prev = 11;
                  _context5.t0 = _context5['catch'](4);
                  return _context5.abrupt('return', res.status(400).send(_context5.t0));

                case 14:
                  promises = question.answers.map(function () {
                    var _ref19 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(answerQues) {
                      var ansImageResponse;
                      return regeneratorRuntime.wrap(function _callee4$(_context4) {
                        while (1) {
                          switch (_context4.prev = _context4.next) {
                            case 0:
                              if (!answerQues.answerimage) {
                                _context4.next = 11;
                                break;
                              }

                              _context4.prev = 1;
                              _context4.next = 4;
                              return getImageFromStorage(answerQues.answerimage);

                            case 4:
                              ansImageResponse = _context4.sent;

                              answerQues.answerimage = ansImageResponse.mediaLink;
                              _context4.next = 11;
                              break;

                            case 8:
                              _context4.prev = 8;
                              _context4.t0 = _context4['catch'](1);
                              return _context4.abrupt('return', res.status(400).send(_context4.t0));

                            case 11:
                            case 'end':
                              return _context4.stop();
                          }
                        }
                      }, _callee4, _this3, [[1, 8]]);
                    }));

                    return function (_x5) {
                      return _ref19.apply(this, arguments);
                    };
                  }());
                  _context5.next = 17;
                  return Promise.all(promises);

                case 17:
                  return _context5.abrupt('return', res.status(200).send(question));

                case 18:
                case 'end':
                  return _context5.stop();
              }
            }
          }, _callee5, _this3, [[4, 11]]);
        }));

        return function (_x4) {
          return _ref18.apply(this, arguments);
        };
      }()).catch(function (error) {
        return res.status(400).send(error);
      });
    }).catch(function (error) {
      return res.status(400).send(error);
    });
  },
  destroy: function destroy(req, res) {
    var _this4 = this;

    var decodedID = void 0;
    var authValues = (0, _authHandler2.default)(req);
    var noTokenProviderError = authValues[0];
    var failedAuthError = authValues[1];
    var decodedIDFromMethod = authValues[2];

    if (noTokenProviderError) return noTokenHandlerError(res);
    if (failedAuthError) return failedAuthHandlerError(res);
    if (decodedIDFromMethod) decodedID = decodedIDFromMethod;

    if (parametersHandlerError(req, res)) {
      return res.status(400).send({ message: 'question not found' });
    }

    Question.findById(req.params.questionId).then(function (result) {
      var question = result.rows[0];
      if (!question) return res.status(404).send({ message: 'question not found' });
      if (decodedID !== question.userid) {
        return res.status(403).send({ auth: false, message: 'User not allowed' });
      }
      Question.destroy({ where: { id: question.id } }).then(_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6() {
        return regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                if (!question.questionimage) {
                  _context6.next = 9;
                  break;
                }

                _context6.prev = 1;
                _context6.next = 4;
                return deleteImageFromStorage(question.questionimage);

              case 4:
                _context6.next = 9;
                break;

              case 6:
                _context6.prev = 6;
                _context6.t0 = _context6['catch'](1);
                return _context6.abrupt('return', res.status(400).send(_context6.t0));

              case 9:
                return _context6.abrupt('return', res.status(204).send());

              case 10:
              case 'end':
                return _context6.stop();
            }
          }
        }, _callee6, _this4, [[1, 6]]);
      })));
    }).catch(function (error) {
      return res.status(400).send(error);
    });
  }
};

exports.default = questionsController;
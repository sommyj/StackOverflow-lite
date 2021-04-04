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


var _ref = [_models2.default.Answer],
    Answer = _ref[0];
var _ref2 = [_models2.default.Question],
    Question = _ref2[0];
var _ref3 = [_filebaseStorage2.default.uploadImageToStorage],
    uploadImageToStorage = _ref3[0];
var _ref4 = [_filebaseStorage2.default.deleteImageFromStorage],
    deleteImageFromStorage = _ref4[0];
var _ref5 = [_errorHandler2.default.createHandlerError],
    createHandlerError = _ref5[0]; // create handleError
// incomplete field handleError

var _ref6 = [_errorHandler2.default.incompleteFieldHandlerError],
    incompleteFieldHandlerError = _ref6[0];
var _ref7 = [_errorHandler2.default.notFoundHandlerError],
    notFoundHandlerError = _ref7[0];
var _ref8 = [_errorHandler2.default.fileHandleError],
    fileHandleError = _ref8[0]; // file handleError
// user deleted handleError

var _ref9 = [_errorHandler2.default.userNotPrestentHandlerError],
    userNotPrestentHandlerError = _ref9[0];
var _ref10 = [_errorHandler2.default.noTokenHandlerError],
    noTokenHandlerError = _ref10[0]; // no token provided handleError
// failed Authentication handlerError

var _ref11 = [_errorHandler2.default.failedAuthHandlerError],
    failedAuthHandlerError = _ref11[0];


var upload = (0, _multer2.default)({
  storage: _multer2.default.memoryStorage()
});

var fileSizeLimit = 1024 * 1024 * 2;

var answersController = {
  upload: upload.single('answerImage'), // image upload
  create: function () {
    var _ref12 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res) {
      var decodedID, authValues, noTokenProviderError, failedAuthError, decodedIDFromMethod, fileName, _ref13, file, fileError, data;

      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              // create a answer
              decodedID = void 0;
              authValues = (0, _authHandler2.default)(req);
              noTokenProviderError = authValues[0];
              failedAuthError = authValues[1];
              decodedIDFromMethod = authValues[2];

              if (!noTokenProviderError) {
                _context.next = 7;
                break;
              }

              return _context.abrupt('return', noTokenHandlerError(res));

            case 7:
              if (!failedAuthError) {
                _context.next = 9;
                break;
              }

              return _context.abrupt('return', failedAuthHandlerError(res));

            case 9:
              if (decodedIDFromMethod) decodedID = decodedIDFromMethod;

              /* Required feilds */

              if (req.body.response) {
                _context.next = 12;
                break;
              }

              return _context.abrupt('return', incompleteFieldHandlerError(res));

            case 12:
              fileName = '';
              _ref13 = [req.file], file = _ref13[0];

              if (!file) {
                _context.next = 27;
                break;
              }

              // implementing the file filter method
              fileError = (0, _fileFilter2.default)(req, fileSizeLimit);

              if (!fileError) {
                _context.next = 18;
                break;
              }

              return _context.abrupt('return', fileHandleError(res, fileError));

            case 18:
              _context.prev = 18;
              _context.next = 21;
              return uploadImageToStorage(file, 'answerImages');

            case 21:
              fileName = _context.sent;
              _context.next = 27;
              break;

            case 24:
              _context.prev = 24;
              _context.t0 = _context['catch'](18);
              return _context.abrupt('return', res.status(400).send(_context.t0));

            case 27:
              data = { // Grab data from http request
                response: req.body.response,
                userId: decodedID,
                questionId: req.params.questionId,
                answerImage: fileName
              };

              Answer.create(data) // pass data to our model
              .then(function (result) {
                var answer = result.rows[0];
                return res.status(201).send(answer);
              }).catch(function (error) {
                if (error.name === 'error' && error.constraint === 'answers_userid_fkey') {
                  return userNotPrestentHandlerError(res, fileName);
                }
                return createHandlerError(error, res, fileName);
              });

            case 29:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this, [[18, 24]]);
    }));

    function create(_x, _x2) {
      return _ref12.apply(this, arguments);
    }

    return create;
  }(),
  update: function update(req, res) {
    var _this = this;

    // update business
    var decodedID = void 0;
    var authValues = (0, _authHandler2.default)(req);
    var noTokenProviderError = authValues[0];
    var failedAuthError = authValues[1];
    var decodedIDFromMethod = authValues[2];

    if (noTokenProviderError) return noTokenHandlerError(res);
    if (failedAuthError) return failedAuthHandlerError(res);
    if (decodedIDFromMethod) decodedID = decodedIDFromMethod;

    Question.findById(req.params.questionId).then(function (result1) {
      var question = result1.rows[0];
      if (!question) return notFoundHandlerError('question', res);
      Answer.findById(req.params.answerId).then(function () {
        var _ref14 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(result2) {
          var answer, fileName, _ref15, file, previousImage, fileError;

          return regeneratorRuntime.wrap(function _callee3$(_context3) {
            while (1) {
              switch (_context3.prev = _context3.next) {
                case 0:
                  answer = result2.rows[0];

                  if (answer) {
                    _context3.next = 3;
                    break;
                  }

                  return _context3.abrupt('return', notFoundHandlerError('answer', res));

                case 3:
                  if (!(decodedID === question.userid && req.body.accepted)) {
                    _context3.next = 5;
                    break;
                  }

                  return _context3.abrupt('return', Answer.update({
                    id: answer.id,
                    response: answer.response,
                    accepted: req.body.accepted || answer.accepted,
                    vote: answer.vote,
                    answerImage: answer.answerimage
                  }).then(function (result3) {
                    return res.status(200).send(result3.rows[0]);
                  }).catch(function (error) {
                    return createHandlerError(error, res);
                  }));

                case 5:
                  if (!(decodedID === answer.userid)) {
                    _context3.next = 23;
                    break;
                  }

                  fileName = '';
                  _ref15 = [req.file], file = _ref15[0];
                  // holds the url of the image before update in other not to loose it

                  previousImage = answer.answerimage;

                  if (!file) {
                    _context3.next = 22;
                    break;
                  }

                  // implementing the file filter method
                  fileError = (0, _fileFilter2.default)(req, fileSizeLimit);

                  if (!fileError) {
                    _context3.next = 13;
                    break;
                  }

                  return _context3.abrupt('return', fileHandleError(res, fileError));

                case 13:
                  _context3.prev = 13;
                  _context3.next = 16;
                  return uploadImageToStorage(file, 'answerImages');

                case 16:
                  fileName = _context3.sent;
                  _context3.next = 22;
                  break;

                case 19:
                  _context3.prev = 19;
                  _context3.t0 = _context3['catch'](13);
                  return _context3.abrupt('return', res.status(400).send(_context3.t0));

                case 22:
                  return _context3.abrupt('return', Answer.update({
                    id: answer.id,
                    response: req.body.response || answer.response,
                    accepted: answer.accepted,
                    vote: answer.vote,
                    answerImage: fileName || answer.answerimage
                  }).then(function () {
                    var _ref16 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(result4) {
                      return regeneratorRuntime.wrap(function _callee2$(_context2) {
                        while (1) {
                          switch (_context2.prev = _context2.next) {
                            case 0:
                              if (!fileName) {
                                _context2.next = 10;
                                break;
                              }

                              if (!previousImage) {
                                _context2.next = 10;
                                break;
                              }

                              _context2.prev = 2;
                              _context2.next = 5;
                              return deleteImageFromStorage(previousImage);

                            case 5:
                              _context2.next = 10;
                              break;

                            case 7:
                              _context2.prev = 7;
                              _context2.t0 = _context2['catch'](2);
                              return _context2.abrupt('return', res.status(400).send(_context2.t0));

                            case 10:
                              return _context2.abrupt('return', res.status(200).send(result4.rows[0]));

                            case 11:
                            case 'end':
                              return _context2.stop();
                          }
                        }
                      }, _callee2, _this, [[2, 7]]);
                    }));

                    return function (_x4) {
                      return _ref16.apply(this, arguments);
                    };
                  }()).catch(function (error) {
                    return createHandlerError(error, res, fileName);
                  }));

                case 23:
                  return _context3.abrupt('return', res.status(403).send({ auth: false, message: 'User not allowed' }));

                case 24:
                case 'end':
                  return _context3.stop();
              }
            }
          }, _callee3, _this, [[13, 19]]);
        }));

        return function (_x3) {
          return _ref14.apply(this, arguments);
        };
      }()).catch(function (error) {
        return createHandlerError(error, res);
      });
    }).catch(function (error) {
      return createHandlerError(error, res);
    });
  }
};

exports.default = answersController;
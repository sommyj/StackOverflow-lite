'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _filebaseStorage = require('./filebaseStorage');

var _filebaseStorage2 = _interopRequireDefault(_filebaseStorage);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _ref = [_filebaseStorage2.default.deleteImageFromStorage],
    deleteImageFromStorage = _ref[0];

// number validation

var isNumber = function isNumber(n) {
  return !Number.isNaN(parseFloat(n));
};

var isFloat = function isFloat(n) {
  return Number(n) === n && n % 1 !== 0;
};

var errorHandler = {
  createHandlerError: function createHandlerError(error, res, fileName) {
    if (fileName) deleteImageFromStorage(fileName); // if file uploads delete it
    return res.status(400).send(error);
  },
  notFoundHandlerError: function notFoundHandlerError(fieldName, res) {
    return res.status(404).send({ message: fieldName + ' not found' });
  },
  incompleteFieldHandlerError: function incompleteFieldHandlerError(res) {
    return res.status(206).send({ message: 'Incomplete field' });
  },
  fileHandleError: function fileHandleError(res, message) {
    // file type handleError
    return res.status(403).json({ message: message, error: true });
  },
  usernameHandlerError: function usernameHandlerError(res) {
    return res.status(400).send({ message: 'username already exists' });
  },
  emailHandlerError: function emailHandlerError(res) {
    return res.status(400).send({ message: 'email already exists' });
  },
  phoneHandlerError: function phoneHandlerError(res) {
    return res.status(400).send({ message: 'phone already exists' });
  },
  questionHandlerError: function questionHandlerError(res) {
    return res.status(400).send({ message: 'question already exists' });
  },
  userNotPrestentHandlerError: function userNotPrestentHandlerError(res, fileName) {
    if (fileName) deleteImageFromStorage(fileName); // if file uploads delete it
    return res.status(400).send({ message: 'user has been removed from the database' });
  },
  noTokenHandlerError: function noTokenHandlerError(res) {
    return res.status(401).send({ auth: false, message: 'No token provided.' });
  },
  failedAuthHandlerError: function failedAuthHandlerError(res) {
    return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
  },
  parametersHandlerError: function parametersHandlerError(req) {
    if (!isNumber(req.params.questionId) || !Number.isInteger(parseInt(req.params.questionId, 10)) || req.params.questionId > 1000000000 || isFloat(parseFloat(req.params.questionId))) {
      return true;
    }return false;
  }
};

exports.default = errorHandler;
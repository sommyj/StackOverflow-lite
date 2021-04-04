'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _app = require('../../../app');

var _app2 = _interopRequireDefault(_app);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* Authentication handle method */
/*  eslint import/no-cycle: [2, { maxDepth: 1 }]  */
var authMethod = function authMethod(req) {
  var authMethodArray = [];
  var noTokenProviderError = false;
  var failedAuth = false;
  var decodedID = void 0;

  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  if (!token) {
    noTokenProviderError = true;
  }

  // verifies secret and checks exp
  _jsonwebtoken2.default.verify(token, _app2.default.get('superSecret'), function (err, decoded) {
    if (err) {
      if (!noTokenProviderError) {
        failedAuth = true;
      }
    } else decodedID = decoded.id;
  });

  authMethodArray[0] = noTokenProviderError;
  authMethodArray[1] = failedAuth;
  authMethodArray[2] = decodedID;

  return authMethodArray;
};

exports.default = authMethod;
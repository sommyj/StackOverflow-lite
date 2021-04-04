'use strict';

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

var _chaiHttp = require('chai-http');

var _chaiHttp2 = _interopRequireDefault(_chaiHttp);

var _app = require('../app');

var _app2 = _interopRequireDefault(_app);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

process.env.NODE_ENV = 'test'; // During the test the env variable is set to test
// Require the dev-dependencies


_chai2.default.should();
_chai2.default.use(_chaiHttp2.default);

describe('/GET /*', function () {
  it('it should GET api message', function (done) {
    _chai2.default.request(_app2.default).get('/anything').end(function (err, res) {
      res.should.have.status(200);
      res.body.message.should.be.eql('Welcome to the beginning of nothingness.');
      done();
    });
  });
});

describe('/GET /api', function () {
  it('it should GET api message', function (done) {
    _chai2.default.request(_app2.default).get('/api').end(function (err, res) {
      res.should.have.status(200);
      res.body.message.should.be.eql('Welcome to the User API!');
      done();
    });
  });
});
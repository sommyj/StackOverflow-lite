// During the test the env variable is set to test
// Require the dev-dependencies
import chai from 'chai';
import chaiHttp from 'chai-http';

import app from '../app';

process.env.NODE_ENV = 'test';

chai.should();
chai.use(chaiHttp);

describe('/GET /*', () => {
  it('it should GET api message', (done) => {
    chai.request(app)
      .get('/anything')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.message.should.be.eql('Welcome to the beginning of nothingness.');
        done();
      });
  });
});

describe('/GET /api', () => {
  it('it should GET api message', (done) => {
    chai.request(app)
      .get('/api')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.message.should.be.eql('Welcome to the User API!');
        done();
      });
  });
});

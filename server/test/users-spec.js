import chai from 'chai';
import supertest from 'supertest';
import fs from 'file-system';
import path from 'path';
import chaiHttp from 'chai-http';

import app from '../app';
import model from '../server/models';

process.env.NODE_ENV = 'test';

chai.should();
chai.use(chaiHttp);
const request = supertest(app);
const [User] = [model.User];

/**
 * delete a file
 * @param {String} targetPath The part to delete from
 * @returns {void} nothing.
 */
const deleteFile = (targetPath) => {
  fs.unlink(targetPath, (err) => {
    if (err) throw err;
  });
};

describe('Users', () => {
  beforeEach((done) => { // Before each test we empty the database
    User.destroy({ where: {}, force: true }).then(() => done());
  });

  describe('/POST user', () => {
    it(`it should not CREATE a user without username, password,
     email, gender`, (done) => {
      request
        .post('/auth/v1/signup')
        .field('title', 'mr')
        .field('firstname', '')
        .field('lastname', '')
        .field('username', '')
        .field('password', '')
        .field('email', '')
        .field('gender', '')
        .field('country', '')
        .field('phone', '')
        .attach('userImage', './testFile.png')
        .end((err, res) => {
          res.should.have.status(206);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('Incomplete field');
          done();
        });
    });

    it('it should CREATE a user', (done) => {
      request
        .post('/auth/v1/signup')
        .field('title', 'mr')
        .field('firstname', 'Justin')
        .field('lastname', 'Ikwuoma')
        .field('username', 'justman')
        .field('password', 'abc')
        .field('email', 'justin@gmail.com')
        .field('gender', 'male')
        .field('country', 'Nigeria')
        .field('phone', '66976498')
        .attach('userImage', './testFile.png')

        .end((err, res) => {
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
          if (path.resolve('./testFile.png')) {
            deleteFile(`./${res.body.user.userimage}`);
          }
          done();
        });
    });

    it('it should CREATE a user without image', (done) => {
      request
        .post('/auth/v1/signup')
        .field('title', 'mr')
        .field('firstname', 'Justin')
        .field('lastname', 'Ikwuoma')
        .field('username', 'justman1')
        .field('password', 'abc')
        .field('email', 'justin1@gmail.com')
        .field('gender', 'male')
        .field('country', 'Nigeria')
        .field('phone', '669796498')
        .attach('userImage', '')
        .end((err, res) => {
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


    it('it should not CREATE a user when image file type not jpg/png', (done) => {
      request
        .post('/auth/v1/signup')
        .field('title', 'mr')
        .field('firstname', 'Justin')
        .field('lastname', 'Ikwuoma')
        .field('username', 'justman2')
        .field('password', 'abc')
        .field('email', 'justin2@gmail.com')
        .field('gender', 'male')
        .field('country', 'Nigeria')
        .field('dob', '2015-11-04')
        .attach('userImage', './testFileType.txt')
        .end((err, res) => {
          res.should.have.status(403);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('Only .png and .jpg files are allowed!');
          res.body.should.have.property('error').eql(true);
          done();
        });
    });

    it(`it should not CREATE a user
      when image file size is larger than 2mb`, (done) => {
      request
        .post('/auth/v1/signup')
        .field('title', 'mr')
        .field('firstname', 'Justin')
        .field('lastname', 'Ikwuoma')
        .field('username', 'justman3')
        .field('password', 'abc')
        .field('email', 'justin3@gmail.com')
        .field('gender', 'male')
        .field('country', 'Nigeria')
        .field('phone', '366976498')
        .attach('userImage', './testFileSize.jpg')
        .end((err, res) => {
          res.should.have.status(403);
          res.body.should.be.a('object');
          res.body.should.have.property('message')
            .eql('file should not be more than 2mb!');
          res.body.should.have.property('error').eql(true);
          done();
        });
    });

    it('it should not CREATE a user if username already exist', (done) => {
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
      }).then(() => {
        request
          .post('/auth/v1/signup')
          .field('title', 'mr')
          .field('firstname', 'Justin')
          .field('lastname', 'Ikwuoma')
          .field('username', 'justman4')
          .field('password', 'abc')
          .field('email', 'justin1@gmail.com')
          .field('gender', 'male')
          .field('country', 'Nigeria')
          .field('phone', '669796498')
          .attach('userImage', '')
          .end((err, res) => {
            res.should.have.status(400);
            res.body.should.be.a('object');
            res.body.should.have.property('message').eql('username already exists');
            done();
          });
      });
    });

    it('it should not CREATE a user if email already exist', (done) => {
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
      }).then(() => {
        request
          .post('/auth/v1/signup')
          .field('title', 'mr')
          .field('firstname', 'Justin1')
          .field('lastname', 'Ikwuoma')
          .field('username', 'justman4')
          .field('password', 'abc')
          .field('email', 'justin4@gmail.com')
          .field('gender', 'male')
          .field('country', 'Nigeria')
          .field('phone', '669796498')
          .attach('userImage', '')
          .end((err, res) => {
            res.should.have.status(400);
            res.body.should.be.a('object');
            res.body.should.have.property('message').eql('username already exists');
            done();
          });
      });
    });

    it('it should not CREATE a user if phone already exist', (done) => {
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
      }).then(() => {
        request
          .post('/auth/v1/signup')
          .field('title', 'mr')
          .field('firstname', 'Justin1')
          .field('lastname', 'Ikwuoma')
          .field('username', 'justman4')
          .field('password', 'abc')
          .field('email', 'justin@gmail.com')
          .field('gender', 'male')
          .field('country', 'Nigeria')
          .field('phone', '669796498')
          .attach('userImage', '')
          .end((err, res) => {
            res.should.have.status(400);
            res.body.should.be.a('object');
            res.body.should.have.property('message').eql('username already exists');
            done();
          });
      });
    });

    it('it should not get a particular user if POST a wrong username', (done) => {
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
      }).then(() => {
        request
          .post('/auth/v1/login')
          .send({ username: 'just', password: 'abc' })
          .end((err, res) => {
            res.should.have.status(400);
            res.body.should.be.a('object');
            res.body.message.should.be.eql('Invalid username/password');
            done();
          });
      });
    });

    it('it should not get a particular user if POST a wrong username', (done) => {
      request
        .post('/auth/v1/signup')
        .field('title', 'mr')
        .field('firstname', 'Justin')
        .field('lastname', 'Ikwuoma')
        .field('username', 'justman4')
        .field('password', 'abc')
        .field('email', 'justin@gmail.com')
        .field('gender', 'male')
        .field('country', 'Nigeria')
        .field('phone', '669796498')
        .attach('userImage', '')
        .end((err, res) => {
          request
            .post('/auth/v1/login')
            .send({ username: 'just', password: 'abc' })
            .end((err, res) => {
              res.should.have.status(400);
              res.body.should.be.a('object');
              res.body.message.should.be.eql('Invalid username/password');
              done();
            });
      });
    });

    it('it should POST username && password and get the particular user', (done) => {
      request
        .post('/auth/v1/signup')
        .field('title', 'mr')
        .field('firstname', 'Justin')
        .field('lastname', 'Ikwuoma')
        .field('username', 'justman4')
        .field('password', 'abc')
        .field('email', 'justin@gmail.com')
        .field('gender', 'male')
        .field('country', 'Nigeria')
        .field('phone', '669796498')
        .attach('userImage', '')
        .end((err, res) => {
          request
            .post('/auth/v1/login')
            .send({ username: 'justman4', password: 'abc' })
            .end((err, res) => {
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

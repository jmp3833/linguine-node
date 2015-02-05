var request = require('supertest')
var chai = require('chai');
var expect = chai.expect;
var app = require('../../app');
var passportMock = require('../passport/passport-mock');

describe('Authentication', function(){
  before(function(){
    passportMock()
  });

  describe('POST /api/login', function(){
    it('should work when valid', function(done){
      request(app)
        .post('/api/login')
        .send({username: 'abc123', password: 'abc123'})
        .expect(200)
        .end(function(err, res){
          expect(err).to.be.null;
          expect(res.body).to.have.property('user');
          done();
        });
    });

    it('should 401 when invalid', function(done){
      request(app)
        .post('/api/login')
        .send({username: 'abc23', password: 'abc123'})
        .expect(401)
        .end(done);
    });
  });

  describe('POST /api/logout', function(){
    it('should work', function(done){
      var agent = request.agent(app);
      agent
        .post('/api/login')
        .send({username: 'abc123', password: 'abc123'})
        .end(function(err, res){
           agent
            .get('/api/logout')
            .expect(200)
            .end(function(err, res){
              expect(err).to.be.null;
              done();
            });
        });
    });
  });
  describe('GET /api/logged_in', function(){
    it('should not work when not logged in', function(done){
     request(app)
        .get('/api/logged_in')
        .expect(200)
        .end(function(err, res){
          expect(err).to.be.null;
          expect(res.body).to.have.property('loggedIn', false);
          done();
        });
    });

    it('should work when logged in', function(done){
      var agent = request.agent(app);
      agent
        .post('/api/login')
        .send({username: 'abc123', password: 'abc123'})
        .end(function(err, res){
           agent
            .get('/api/logged_in')
            .expect(200)
            .end(function(err, res){
              expect(err).to.be.null;
              expect(res.body).to.have.property('loggedIn', true);
              done();
            });
        });
    });
  });
});

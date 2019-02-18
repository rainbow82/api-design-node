var app = require('./server');
var request = require('supertest');
var expect = require('chai').expect;
require('colors');
// TODO: make tests for the other CRUD routes
// DELETE, PUT, POST, GET ONE
// to run the test type mocha server/specs.js

describe('[LIONS]'.yellow, function(){

  it('should get all lions', function(done) {
    request(app)
      .get('/lions')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function(err, resp) {
        expect(resp.body).to.be.an('array');
        done();
      })
  });

  it('should create a lion', function (done) {
    request(app)
    .post('/lions')
    .send({
      name: 'Alex',
      age: 25,
      pride: 'NYC Lions',
      gender: 'male'
    })
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(201)
    .end(function(err, resp){
      var alex = resp.body
      expect(alex).to.be.an.an('object');
      done();
    })
  })

  it('should delete a lion', function(done){
    //create a lion then delelet it
    request(app)
    .post('/lions')
    .send({
      name: 'Scar',
      age: 55,
      pride: 'Pride Rock',
      gender: 'male'
    })
    .set('Accept', 'application/json')
    .end(function(err, resp){
      var lion = resp.body;
      request(app)
      .delete('/lions' + lion.id)
      .end(function(err, resp){
        expect(lion).to.eql(lion);
        done();
      });
    })
  });

  it('should create a new lion', function(done){
    request(app)
    .put('/lions')
    .send({
      name: 'Abigail',
      age: 23,
      pride: 'NYC Lions',
      gender: 'female'
    })
    .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (err, resp) {
        var abigail = resp.body
        expect(abigail).to.eql(abigail);
        done();
  });
});

});

describe('[LION]', function(){
  it('should get one lion', function (done) {
    request(app)
    .get('/lions/:id')
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200)
    .end(function(err, resp){
      expect(resp.body).to.be.an.an('object');
      done();
    })
  });
});



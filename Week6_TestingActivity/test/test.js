// test/test.js


const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server'); // Adjust path if necessary
const expect = chai.expect;

chai.use(chaiHttp);

describe('Message API Tests', () => {
    let messageId;

    // Test GET /messages
    it('should fetch all messages', (done) => {
        chai.request(server)
            .get('/messages')
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('array');
                done();
            });
    });

    // Test POST /messages
    it('should add a new message', (done) => {
        chai.request(server)
            .post('/messages')
            .send({ text: 'Hello, this is a test message!' })
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('text', 'Hello, this is a test message!');
                messageId = res.body._id; // Save the message ID for later tests
                done();
            });
    });

    // Test PUT /messages/:id
    it('should update the message', (done) => {
        chai.request(server)
            .put(`/messages/${messageId}`)
            .send({ text: 'Updated test message' })
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('success', true);
                done();
            });
    });

    // Test DELETE /messages/:id
    it('should delete the message', (done) => {
        chai.request(server)
            .delete(`/messages/${messageId}`)
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('object');
                expect(res.body._id).to.equal(messageId);
                done();
            });
    });
});

/*


var expect  = require("chai").expect;
var request = require("request");

describe("Add Two Numbers", function() {
    var url = "http://localhost:8080/addTwoNumbers/3/5";
    it("returns status 200 to check if api works", function(done) {
        request(url, function(error, response, body) {
            expect(response.statusCode).to.equal(200);
            done()
          });
    });
    it("returns statusCode key in body to check if api give right result should be 200", function(done) {
        request(url, function(error, response, body) {
            body = JSON.parse(body)
            expect(body.statusCode).to.equal(200);
            done()
          });
    });
    it("returns the result as number", function(done) {
        request(url, function(error, response, body) {
            body = JSON.parse(body)
            expect(body.result).to.be.a('number');
            done()
          });
    });
    it("returns the result equal to 8", function(done) {
      request(url, function(error, response, body) {
          body = JSON.parse(body)
          expect(body.result).to.equal(8);
          done()
        });
  });
  it("returns the result not equal to 15", function(done) {
    request(url, function(error, response, body) {
        body = JSON.parse(body);
        expect(body.result).to.not.equal(15);
        done()
      });
});
  });

  describe("Add Two strings", function() {
    var url = "http://localhost:8080/addTwoNumbers/a/b";
    it("should return status 200", function(done) {
        request(url, function(error, response, body) {
           // resp = JSON.parse(response);
           // console.log(response);
            expect(response.statusCode).to.equal(200);
            done()
          });
    });
    it("returns statusCode key in body to check if api gives right result should be 400", function(done) {
        request(url, function(error, response, body) {
            body = JSON.parse(body)
            expect(body.statusCode).to.equal(400);
            done()
          });
    });
    it("returns the result as null", function(done) {
        request(url, function(error, response, body) {
            body = JSON.parse(body)
            expect(body.result).to.be.a('null');
            done()
          });
    });
  });

*/

 
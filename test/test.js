const PORT = process.env.PORT || 3000;

const fs = require('fs');
const quotes = require('./quotes.json');
const app = require('../server/server.js');
const chai = require('chai');
const chaiHttp = require('chai-http');
const chalk = require('chalk');
const should = chai.should();

app.listen(PORT, () => console.log(
  //sets server to listen to PORT and outputs to the CL
  chalk.yellow.bold('Test server listening on port: ')
  + chalk.cyan.bold(PORT)
));

chai.use(chaiHttp);

describe('GET /api/', () => {
  let status, response, quotes;

  before(done => {
    chai.request(app)
      .get('/api/')
      .set(
      'Content-Type', 'application/json'
      )
      .end((err, res) => {
        status = res.status;
        response = res.text;
        done();
      });
    });
    
    it('should return status 200.', done => {
      status.should.equal(200);
      done();
    });
    
    it('should be a JSON object.', done => {
      response.should.be.a('string');
      response = JSON.parse(response);
      response.should.be.an('array');
      done();
  });


  it('should have a "id", "quote" and "author" property containing an array.', done => {
    for (let quote of response) {
      quote.should.be.an('object');
      quote.should.have.a.property('id');
      quote.should.have.a.property('quote')
      quote.should.have.a.property('author');
    }
    done();
  });

  xit('should allow an author parameter.', done => {
    chai.request(app)
      .get('/api/quotes?author=\'\'')
      .set(
      'Content-Type', 'application/json'
      )
      .end((err, res) => {
        JSON.parse(res.text).length.should.equal(0);
        done();
      });
  });
});

xdescribe('GET /api/quotes/random', () => {
  let status, response;

  before(done => {
    chai.request(app)
      .get('/api/quotes')
      .set(
      'Content-Type', 'application/json'
      )
      .end((err, res) => {
        status = res.status;
        response = res.text;
        done();
      });
  });

  it('should return status 200.', done => {
    status.should.equal(200);
    done();
  });

  xit('should be a JSON object.', done => {
    response.should.be.a('string');
    response = JSON.parse(response);
    response.should.be.an('object');
    done();
  });

  xit('should be random', done => {
    let a, b;
    chai.request(app)
      .get('/api/quotes/random')
      .set(
      'Content-Type', 'application/json'
      )
      .end((err, res) => {
        a = res.text;
        chai.request(app)
          .get('/api/quotes/random')
          .set(
          'Content-Type', 'application/json'
          )
          .end((err, res) => {
            b = res.text;
            a.should.not.equal(b);
            done();
          });
      });
  });
});

describe('POST/PUT Tests', () => {
  // This is to make sure each test is run under with the same starting data
  // const quotesFile = './server/data/quotes.txt';
  // const quotesBackup = quotesFile + '.bak';

  // beforeEach(() => {
  //   fs.createReadStream(quotesFile).pipe(fs.createWriteStream(quotesBackup));
  // });

  // afterEach(() => {
  //   fs.createReadStream(quotesBackup).pipe(fs.createWriteStream(quotesFile));
  //   fs.unlinkSync(quotesBackup);
  // });

  describe('POST /api/quotes', () => {

    before(done => {
      chai.request(app)
        .put('/api/')
        .set(
        'Content-Type', 'application/json'
        )
        .send(quotes)
        .end(() => {
          done();
        })
    });

    after(done => {
      chai.request(app)
        .put('/api/')
        .set(
        'Content-Type', 'application/json'
        )
        .send(quotes)
        .end(() => {
          done();
        })
    });

    let status, response, appendData = {
      "text": "Wubba lubba dub dub!",
      "author": "Rick Sanchez"
    };

    it('should return true as a response.', done => {
      chai.request(app)
        .post('/api/')
        .set(
          'Content-Type', 'application/json'
        )
        .send({
          quote: "ffff",
          author: "ggggg"
        })
        .end((err, res) => {
          // console.log(res, "@@@@@@@@@@@@@@@");
          res.status.should.equal(400);
          done();
        })
    });

    xit('should return status 400 if "text" is empty.', done => {
      chai.request(app)
        .post('/api/quotes')
        .set(
        'Content-Type', 'application/json'
        )
        .send({
          text: ''
        })
        .end((err, res) => {
          res.status.should.equal(400);
          done();
        })
    });

    xit('should append new entries to the end of the file.', done => {
      chai.request(app)
        .post('/api/quotes')
        .set(
        'Content-Type', 'application/json'
        )
        .send(appendData)
        .end((err, res) => {
          status = res.status;
          chai.request(app)
            .get('/api/quotes')
            .set(
            'Content-Type', 'application/json'
            )
            .end((err, res) => {
              JSON.parse(res.text).quotes.pop().should.deep.equal(appendData);
              done();
            })
        })
    });

    xit('should fill in blank or missing authors with "Anonymous".', done => {
      //Your code here!
    });

  });

  xdescribe('PUT /api/quotes', () => {

    before(done => {
      chai.request(app)
        .put('/api/quotes')
        .set(
        'Content-Type', 'application/json'
        )
        .send(quotes)
        .end((err, res) => {
          status = res.status;
          done();
        })
    });

    let status, response;

    it('should return a 200 status.', done => {
      status.should.equal(200);
      done();
    });

    xit('should overwrite the existing quote file.', done => {
      chai.request(app)
        .get('/api/quotes')
        .set(
        'Content-Type', 'application/json'
        )
        .end((err, res) => {
          JSON.parse(res.text).quotes.should.deep.equal(quotes);
          done();
        })
    });

    xit('should return status 400 if "text" is empty.', done => {
      chai.request(app)
        .put('/api/quotes')
        .set(
        'Content-Type', 'application/json'
        )
        .send([{
          text: ''
        }])
        .end((err, res) => {
          res.status.should.equal(400);
          done();
        })
    });

    xit('should fill in blank or missing authors with "Anonymous".', done => {
      //Your code here!
    });

    xit('should clear the file if passed an empty request body');
  });
});
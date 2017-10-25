const chai = require('chai');
const r2base = require('r2base');
const r2mongoose = require('r2mongoose');
const r2query = require('r2query');
const plugin = require('../index');

const expect = chai.expect;
process.chdir(__dirname);

const app = r2base();
app.start()
  .serve(r2mongoose, { database: 'r2plugin' })
  .serve(r2query)
  .serve(plugin)
  .load('model')
  .into(app);

const Test = app.service('model/test');

before((done) => {
  // wait for connection
  app.service('Mongoose').connection.on('open', () => done());
});

describe('r2plugin', () => {
  it('should set mongoose-findorcreate', (done) => {
    expect(Test.findOrCreate).to.not.equal(undefined);
    done();
  });

  it('should set mongoose-beautiful-unique-validation', (done) => {
    Test.create({ email: 'test@abc.com' })
      .then(() => Test.create({ email: 'test@abc.com' }))
      .then(done)
      .catch((err) => {
        expect(err.errors.email.message).to.equal('Path `email` (test@abc.com) is not unique.');
        done();
      });
  });

  it('should set mongoose-delete', (done) => {
    expect(Test.delete).to.not.equal(undefined);
    expect(Test.restore).to.not.equal(undefined);
    done();
  });

  it('should set mongoose-id-validator', (done) => {
    Test.create({ test: '000000000000000000000001' })
    .then(done)
    .catch((err) => {
      expect(err.errors.test.message).to.equal('test references a non existing ID');
      done();
    });
  });

  it('should set mongoose-paginate', (done) => {
    expect(Test.paginate).to.not.equal(undefined);
    done();
  });

  it('should set mongoose-find-or-error', (done) => {
    expect(Test.findOneOrError).to.not.equal(undefined);
    done();
  });

  it('should set mongoose-batches', (done) => {
    expect(Test.findInBatches).to.not.equal(undefined);
    done();
  });
});

function dropDatabase(done) {
  this.timeout(0);
  app.service('Mongoose').connection.db.dropDatabase();
  done();
}

after(dropDatabase);

process.env.PORT = 3020;
process.env.WINDOWMS = 5000;
process.env.MAX = 3;
process.env.RATE_LIMITING_ENABLED = true;

const sinon = require('sinon');
let sandbox = sinon.createSandbox();
sandbox.stub(process.env, 'WINDOWMS').value('5000');
sandbox.stub(process.env, 'MAX').value('3');
sandbox.stub(process.env, 'RATE_LIMITING_ENABLED').value('true');

var expect = require('chai').expect;
var chai = require('chai');
chai.use(require('chai-http'));
var requests = [], _;
var app, request;
app = require('../server');
request = chai.request.agent(app);

describe('API limit rate', function () {

    this.timeout(10000);

    it('should get too many requests response after 3 requests', async function () {
        for (var i = 1; i <= 3; i++) {
            requests.push(request.get('/'));
        }
        _ = await Promise.all(requests);
        try {
            if (_) {
                var response = await request.get('/');
                expect(response.status).to.be.equal(429);
            }
        } catch (err) {
            expect(err.status).to.be.equal(429);
        }
    });
    after(function () {
        sandbox.restore();
    });
});
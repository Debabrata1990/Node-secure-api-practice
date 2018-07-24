var should = require('should'),
    sinon = require('sinon');


describe('Book controller tests', function () {
    describe('Post', function () {
        it('should not allow a empty post', function () {
            var Book = function (book) {
                this.save = function () {};
            };
            var req = {
                body: {
                    author: 'John'
                }
            };

            var res = {
                status: sinon.spy(),
                send: sinon.spy()
            };

            var bookController = require('../controller/bookController')(Book);
            bookController.post(req, res);

            res.status.calledWith(400).should.equal(true, 'Bad status ' + res.status.args[0][0]);
            res.send.calledWith('title is required').should.equal(true);
        });
    });
});
var express = require('express');
var jwt = require('jsonwebtoken');
var config = require('../config');

var router = function (Book) {
    var bookRouter = express.Router();

    var bookController = require('../controller/bookController')(Book);

    // route middleware to verify a token
    bookRouter.use(function (req, res, next) {
        var token = req.body.token || req.query.token || req.headers['x-access-token'];

        if (token) {
            jwt.verify(token, config.secret, function (err, decoded) {
                if (err) {
                    return res.json({
                        success: false,
                        message: 'Failed to authenticate token.'
                    });
                } else {
                    req.decoded = decoded;
                    next();
                }
            });
        } else {
            return res.status(403).send({
                success: false,
                message: 'No token provided.'
            });

        }
    });

    bookRouter.route('/')
        .post(bookController.post)
        .get(bookController.get);


    bookRouter.use('/:bookId', function (req, res, next) {
        Book.findById(req.params.bookId, function (err, book) {
            if (err) {
                res.status(500).send(err);
            } else if (book) {
                req.book = book;
                next();
            } else
                res.status(404).send('book not found');
        });
    });
    bookRouter.route('/:bookId')
        .get(bookController.getById)
        .put(bookController.putById)
        .patch(bookController.patchById)
        .delete(bookController.deleteById);

    return bookRouter;
};

module.exports = router;
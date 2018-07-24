var bookController = function (Book) {
    var post = function (req, res) {
        var book = new Book(req.body);

        if (!req.body.title) {
            res.status(400);
            res.send('title is required');
        }

        book.save();
        res.status(201);
        res.send(book);
    };

    var get = function (req, res) {
        var query = req.query;
        Book.find(query, function (err, books) {
            if (err) {
                res.status(500);
                res.send(err);
            } else {
                var returnBooks = [];
                books.forEach((element, index, array) => {
                    var newBook = element.toJSON();
                    newBook.links = {};
                    newBook.links.self = 'http://' + req.headers.host + '/api/books/' + newBook._id;
                    returnBooks.push(newBook);
                });
                res.json(returnBooks);
            }
        });
    };

    var getById = function (req, res) {
        var returnBook = req.book.toJSON();

        returnBook.links = {};
        var newLink = 'http://' + req.headers.host + '/api/books?genre=' + returnBook.genre;
        returnBook.links.FilterByThisGenre = newLink.replace(' ', '%20');
        res.json(returnBook);
    };

    var putById = function (req, res) {
        req.book.title = req.body.title;
        req.book.author = req.body.author;
        req.book.genre = req.body.genre;
        req.book.read = req.body.read;
        req.book.save(function (err) {
            if (err) {
                res.status(500).send(err);
            } else {
                res.json(req.book);
            }
        });
    };

    var patchById = function (req, res) {
        if (req.body._id)
            delete req.body._id;
        for (var p in req.body) {
            req.book[p] = req.body[p];
        }
        req.book.save(function (err) {
            if (err) {
                res.status(500).send(err);
            } else {
                res.json(req.book);
            }
        });
    };

    var deleteById = function (req, res) {
        req.book.remove(function (err) {
            if (err) {
                res.status(500).send(err);
            } else {
                res.status(204).send('removed');
            }
        });
    };

    return {
        post: post,
        get: get,
        getById: getById,
        putById: putById,
        patchById: patchById,
        deleteById: deleteById
    };
};

module.exports = bookController;
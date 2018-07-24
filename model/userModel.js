var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var userModel = new Schema({
    name: {
        type: String
    },
    password: {
        type: String
    },
    admin: {
        type: Boolean
    }
});

module.exports = mongoose.model('User', userModel, 'User');
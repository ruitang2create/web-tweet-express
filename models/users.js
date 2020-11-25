const passportLocalMongoose = require('passport-local-mongoose');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UsersSchema = new Schema({
    name: { type: String, required: true },
    username: { type: String, required: true },
    location: String,
    bio: String,
    avatarUrl: { type: String, default: '/img/avatar.jpg' }
});

UsersSchema.plugin(passportLocalMongoose);

const Users = mongoose.model('Users', UsersSchema);

module.exports = Users;
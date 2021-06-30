// Holds detrails about the Schema. Mongodb is schemaless with mongoose we can specify a schema
const {model, Schema} = require('mongoose'); 

const userSchema = new Schema({
    // Passing fields..
    username: String,
    password: String,
    email: String,
    createdAt: String 
});

module.exports = model('User', userSchema);
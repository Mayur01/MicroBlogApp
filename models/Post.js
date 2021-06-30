const {model, Schema} = require('mongoose'); 

const postSchema = new Schema({
    body: String,
    username: String,
    createdAt: String,
    comments: [
        {
            body: String,
            username: String,
            createdAt: String
        }
    ],
    likes: [
        {
            username: String,
            createdAt: String
        }
    ],
    // linking data models (no necesito) 
    user:{
        type: Schema.Types.ObjectId,
        ref:'users'  // here users is collection/table. 
    }
});

module.exports = model('Post', postSchema);
const { AuthenticationError, UserInputError } = require('apollo-server');

const Post = require('../../models/Post');
const checkAuth = require('../../utils/check-auth');

module.exports={
    Query: {
        async getPosts(){
            // console.log('getPosts');
            try{
                const posts = await Post.find().sort({createdAt: -1}); //.sort to display latest posts
                return posts;
            } catch(err){
                throw new Error(err);
            }
        },
        async getPost(_, { postId }){
            try{
                const post = await Post.findById(postId);
                if(post)
                {
                    return post;
                } else {
                    throw new Error('Post not found');
                }
            } catch (err){
                throw new Error(err);
            }
        } 
    },
    Mutation: {
        async createPost(_, { body }, context){
            // console.log('createPosts');
            const user =  checkAuth(context);

            if(body.trim()===''){
                throw new Error('Post body cannot Be Empty');
            }

            const newPost = new Post({
                body,
                user: user.id,
                username: user.username,
                createdAt: new Date().toISOString()
            });

            // Save the created post
            const post = await newPost.save();
            return post; 
        },
        
        async deletePost(_, { postId }, context){
            const user = checkAuth(context);
            try{
                const post = await Post.findById(postId);
                if(user.username === post.username){
                    await post.delete();
                    return 'Post deleted successfully';
                } else {
                    throw new  AuthenticationError('Action not allowed');   
                }
            } catch(err) {
                throw new Error(err);
            }
        },
        async likePost(_, {postId}, context){
            const { username } = checkAuth(context);

            const post =  await Post.findById(postId);
            if(post){
                if(post.likes.find((like) => like.username === username)){        //this returns an object and if not fount return Undefined
                    //post already liked, unlike it.
                    post.likes = post.likes.filter((like) => like.username !== username);
                } else {
                    //post not liked, Like it
                    post.likes.push({
                        username,
                        createdAt: new Date().toISOString()
                    })
                }
                await post.save();
                return post;
            } else throw new UserInputError('Post not found'); 
        }
    }
}; 
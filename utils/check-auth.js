const { AuthenticationError } = require('apollo-server');

const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../config.js');

module.exports = (context) =>{
    //context will have objects and have headers = {... headers ..}
    const authHeader = context.req.headers.authorization;
    if(authHeader){
        //if authheader is present get token from it..send header w
        // authorisation token convention {Bearer token}
        const token = authHeader.split('Bearer ')[1]; 
        if(token){
            try{
                const user = jwt.verify(token, SECRET_KEY);
                return user;
            } catch(err){
                //throwing specific error
                throw new AuthenticationError('Invalid or Expired token');
            }
        }
        throw new Error('Authentication token must be \'Bearer [token]');
    } 
    throw new Error('Authorization header must be provided');
}; 
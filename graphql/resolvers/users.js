const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UserInputError } = require('apollo-server'); //apollo will recognise the error and handle it differently

const { validateRegisterInput, validateLoginInput }  = require('../../utils/validator');
const { SECRET_KEY }= require('../../config');
const User = require('../../models/User');

function generateToken(user){
    return jwt.sign({
        id: user.id,
        email: user.email,
        username: user.username
    }, SECRET_KEY, 
    { expiresIn: '1h'}
    );
}



module.exports = {
    Mutation: {
        async login(_, {username, password}){
            const {valid,errors} = validateLoginInput(username, password);
            const user = await User.findOne({username});
            if(!valid){
                throw new UserInputError('Errors',{errors});
            }
            if(!user){
                errors.general='User not found!';
                throw new UserInputError('User not found',{errors});
            }

            const match = await bcrypt.compare(password, user.password);
            if(!match)
            {
                errors.general='Incorrect Username or Password';
                throw new UserInputError('Incorrect Username or Password',{errors});
            }
            // if username and password is correct. Issue a token
            const token = generateToken(user);
            return {
                ...user._doc,
                id: user._id,
                token
            };
        },
       async register(_, { registerInput: { username, email, password, confirmPassword } }, context, info) 
        {
            // Validate User data
            const {valid, errors} = validateRegisterInput(username, email, password, confirmPassword);
            if(!valid){
                throw new UserInputError('Errors', {errors});
            }
            // Make sure user does not exists
            const user = await User.findOne({username});    
            if(user){
                throw new UserInputError('Username already exists',{
                    errors: {
                        username: 'Username already exists ' 
                    }
                })
            }

            // Hash password(bcryptjs) before storing it in DB and create auth Token(jsonwebtoken).
            password = await bcrypt.hash(password, 12);   //hashing password
            
            const newUser = new User({
                email,
                username,
                password,
                createdAt: new Date().toISOString()
            });

            const res = await newUser.save();

            const token = generateToken(res)
            return {
                ...res._doc,
                id: res._id,
                token
            };
        }
    }
};
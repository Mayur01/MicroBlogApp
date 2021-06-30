module.exports.validateRegisterInput=(
    username,
    email,
    password,
    confirmPassword
)=>{
    const errors = {};
    if(username.trim() === ''){
        errors.username = 'Username cannot be Empty';
    }

    if(email.trim() === ''){
        errors.email = 'Email cannot be Empty';
    } else {
        const regEx = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
        if(!email.match(regEx)){
            errors.email = 'Email address is Not valid.'
        }
    }
    if(password === ''){
        errors.password = 'Password cannot be empty';
    } else if(password !== confirmPassword){
        errors.confirmPassword = 'Password does not Match';
    }

    return {
        errors,
        valid: Object.keys(errors).length <1
    };
};

module.exports.validateLoginInput=(username, password) => {
    const errors ={};
    if(username.trim() === ''){
        errors.username = 'Username cannot be Empty';
    }
    
    if(password.trim() === ''){
        errors.password = 'Password cannot be Empty';
    }
    return {
        errors,
        valid: Object.keys(errors).length <1
    };
}
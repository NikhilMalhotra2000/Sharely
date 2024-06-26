const jwt = require('jsonwebtoken');
const User = require('../models/user');

const auth = async (req,res,next) =>{
    try {
        const token = req.header('Authorization').replace('Bearer ','');
        const decoded = jwt.verify(token,'nick');
        const user = await User.findOne({_id: decoded._id, 'tokens.token' : token});
        
        if(!user){
            throw new Error();
        }
        req.token = token; // used to logout of specific token ,if user is logged in many sessions
        req.user = user;  // we found the user so will append in request so dont need to find user again and again.
        next();
    } catch (error) {
        res.status(401).send('Error : Please Authenticate correctly');
    }
}


module.exports = auth;
const jwt = require('jsonwebtoken');
const {jwtConfig} = require('./config');
const {secret,expiresIn} = jwtConfig;
const bearToken = require('express-bearer-token');

const getUserToken = (user) => {
    const userDataForToken = {
        id: user.id,
        email: user.email
    };

    const token = jwt.sign(
        {data:userDataForToken},
        secret,
        {expiresIn: parseInt(expiresIn,10)}
    );
    return token;
}

const restoreUser = (req,res,nex) => {
    const{token} = req;

    if(!token){
        return res.set('WWW-Authenticate','Bearer').status(401).end();
    }

    return jwt.verify(token,secret,null,async(err,jwtPayload) => {
        if(err){
            err.status = 401;
            return next(err);
        }else{
            const {id} = jwtPayload.data;
        }

    });
}
module.exports = {
    getUserToken,
};

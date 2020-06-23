const jwt = require('jsonwebtoken');

//Verify Token
function verifyToken(req, res, next) {
    //Get auth header value
    const bearerHeader = req.headers['authorization'];
    //Check if bearer is undefined
    if (typeof bearerHeader !== 'undefined') {
        //Split at the space
        const bearer = bearerHeader.split(' ')[1];
        //Set the token
        req.token = bearer;
        //Next middleware
        next();
    } else {
        //Forbidden
        res.sendStatus(403);
    }
}

function generateToken(user, callback) {
    jwt.sign({ user }, 'secretkey', {expiresIn: '60s'}, (err, token) => {
        callback (err, token);
    });
}

module.exports = {
    verifyToken,
    generateToken
};
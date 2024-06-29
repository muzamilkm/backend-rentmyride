require('dotenv').config;
const jwt = require('jsonwebtoken')
const SECRET_KEY = process.env.SECRET_KEY;

function authenticateToken(req, res, next) {
    const token = req.headers['authorization'];
    if (token == null) return res.sendStatus(401).message({err: 'No token provided'});

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403).json({err: 'Invalid token. Error: ' + err});
        req.user = user;
        next();
    })
}

module.exports = authenticateToken;
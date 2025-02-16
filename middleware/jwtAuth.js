require('dotenv').config;
const jwt = require('jsonwebtoken')
const SECRET_KEY = process.env.SECRET_KEY;

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.status(401).json({error: 'No token provided'});

    jwt.verify(token, SECRET_KEY, (err, user) => { 
        if (err) return res.status(403).json({ error: 'Invalid token. Error: ' + err });
        req.user = user;
        next();
    });
}

module.exports = authenticateToken;
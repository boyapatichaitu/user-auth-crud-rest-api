const express = require('express'),
    jwt = require('jsonwebtoken');

var app = express(),
    cors = require('cors');

app.use(express.json());

app.use(cors());

const loginRouter = require('./routes/loginOrSignUp'),
    operationsRouter = require('./routes/userOperations'),
    mongoUtils = require('./utils/mongoConnect'),
    authUtils = require('./utils/authUtil');

app.use('/login', loginRouter);
app.use('/user', operationsRouter);

app.get('/getUsers', authUtils.verifyToken, (req, res) => {
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if (err) {
            res.sendStatus(403);
        } else {
            mongoUtils.accessDb('userAuth', 'users', function (users) {
                res.json(users);
            });
        }
    });

});

// 404
app.use(function (req, res, next) {
    return res.status(404).send({ message: 'Route ' + req.url + ' is not found.' });
});

// 500 - Any server error
app.use(function (err, req, res, next) {
    return res.status(500).send({ error: err });
});

app.listen(3001, () => {
    console.log("Server running on port 3001");
});
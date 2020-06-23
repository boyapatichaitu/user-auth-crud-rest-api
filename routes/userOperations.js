var express = require('express');
var opRouter = express.Router();
const jwt = require('jsonwebtoken');

const authUtils = require('../utils/authUtil');
var mongoUtils = require('../utils/mongoConnect');

opRouter.post('/update', authUtils.verifyToken, (req, res) => {
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if (err)
            res.sendStatus(401);
        else
            mongoUtils.updateUser('userAuth', 'users', req.body, function (response) {
                res.json({
                    message: 'User Details have been updated.',
                    nextStep: 'Enjoy!!!'
                });
            });
    });
});

opRouter.delete('/remove', authUtils.verifyToken, (req, res) => {
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if (err)
            res.sendStatus(401);
        else
            mongoUtils.removeUser('userAuth', 'users', req.body, function (response) {
                if (response.deletedUser) {
                    res.json({
                        message: 'User has been removed.',
                        nextStep: 'Enjoy!!!',
                        usersDeleted: response.deletedCount
                    });
                } else {
                    res.status(404)
                    res.json({
                        message: 'No such user.',
                        nextStep: 'Try again'
                    })
                }

            });
    });
});

module.exports = opRouter;

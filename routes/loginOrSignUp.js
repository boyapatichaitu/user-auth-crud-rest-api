var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');

const authUtils = require('../utils/authUtil');
var mongoUtils = require('../utils/mongoConnect');

router.post('/', (req, res) => {
    mongoUtils.findUser('userAuth', 'users', req.body, function (response) {
        if (response.length > 0) {
            authUtils.generateToken(response[0], (err, token) => {
                res.json({
                    user: { ...response[0] },
                    token
                });
            });
        } else {
            res.status(401);
            res.json({
                message: 'Check your Email and Password.',
                nextStep: 'Please Re-enter.'
            });
        }
    });
});

router.get('/verify', authUtils.verifyToken, (req, res) => {
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if (err)
            res.sendStatus(401);
        else
            res.json({
                message: 'User Verified.',
                nextStep: 'Enjoy!!!',
                authData
            });
    });
});

router.post('/sign-up', (req, res) => {
    const user = req.body;
    mongoUtils.createUser('userAuth', 'users', user, function (response) {
        if (response.status === 409) {
            res.status(response.status);
            res.json({
                message: 'Email is already registered.',
                nextStep: 'Please Login.'
            });
        } else {
            const createdUserData = {
                email: response.ops[0].email,
                firstName: response.ops[0].firstName,
                lastName: response.ops[0].lastName,
                role: response.ops[0].role
            };
            authUtils.generateToken(createdUserData, (err, token) => {
                res.json({
                    user: { ...createdUserData },
                    token
                });
            });
        }
    });
});

module.exports = router;

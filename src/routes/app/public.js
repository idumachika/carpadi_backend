const publicRoutes = require('express').Router();
const userControl = require('../user');

publicRoutes.post('/register', userControl.register);
publicRoutes.post('/login', userControl.login);
publicRoutes.post('/forgot_pword', userControl.login);
publicRoutes.post('/reset_pword', userControl.login);

module.exports = publicRoutes;
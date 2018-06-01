/***********************
 * Module dependencies *
 ***********************/
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

/**********************
 *  Imported files    *
 **********************/
const config = require('../../../config');
const publicRoutes = require('./public');
const privateRoutes = require('./private');


const admin = require('../admin'); 
// const event = require('../events');

router.use(admin);
// router.use(event);

//All public routes
router.use(publicRoutes);
router.use(admin);


//All private routes will come in here

/******************
 * Export router  *
 ******************/
module.exports = router;

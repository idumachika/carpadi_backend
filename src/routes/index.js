const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const config = require('../../config');
const user = require('./app/index');


router.get('/', (req, res) => {
    res.json({status: 200, message:'Welcome'});
});

//All routes to be used
router.use('/farm', user);

module.exports = router;
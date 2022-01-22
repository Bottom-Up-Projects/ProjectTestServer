var express = require('express');
var router = express.Router();
var viewsVariables = require('./../public/javascripts/variables');
var session = require('./../public/javascripts/session');

router.get('/', (req, res, next) => {
    res.render('scoreboard', Object.assign(viewsVariables, {authorized: true}));
});

module.exports = router;
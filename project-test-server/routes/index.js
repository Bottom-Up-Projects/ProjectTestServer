const { urlencoded } = require('express');
var express = require('express');
const app = require('../app');
var router = express.Router();
var cookieID = 0;

router.get('/', function(req, res, next) {
  res.render('index');
  // console.log(process.env.PW);
});

module.exports = router;

var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var sessionStorage = require('./../public/javascripts/session');
var bycrypt = require('bcrypt');
var viewsVariables = require('./../public/javascripts/variables');
var saltRounds = 10;

require('dotenv').config();

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

connection.connect((err) => {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }
  console.log('connected as id ' + connection.threadId);
});


/* GET home page. */
router.get('/', function(req, res, next) {
  // res.send("Hello World!");
  if(req.cookies.sessionid != undefined && req.cookies.sessionid == sessionStorage.getSession(req.cookies.username)){
    res.render('main', Object.assign(viewsVariables, {authorized: true, username : req.cookies.username}));
  }else{
    res.render('main', Object.assign(viewsVariables, {authorized: false}));
  }
});

router.get('/login', (req, res, next) => {
  res.render('login', viewsVariables);
})

router.post('/login', (req, res, next) => {
  var { username, password } = req.body;

  const sqlQuery = `SELECT * FROM users WHERE uid = ?;`;
  var sqlParams = [username];
  connection.query(sqlQuery, sqlParams, (err, results) => {
    if (err) {
      console.error(err);
      res.send(`<script>alert('Database Connection Error!'); location.href='/login'</script>`);
      return;
    }
    if (results.length > 0 && bycrypt.compareSync(password, results[0].password)) {
      sessionStorage.insertSession(username);
      var userSession = sessionStorage.getSession(username);
      
      res.cookie('sessionid', userSession, { maxAge: 900000, httpOnly: true });
      res.cookie('username', username, { maxAge: 900000, httpOnly: true });
      res.redirect('/');
    } else { 
      res.send(`<script>alert('Wrong ID or Password!');location.href="/login"</script>`);
    }
  });
});

router.get('/register', (req, res, next) => {
  res.render('register', viewsVariables);
});

router.post('/register', (req, res, next) => {
  var { username, password } = req.body;
  // check account condition
  if(username.length < 4 || username.length > 20 || password.length < 4){
    res.send(`<script>alert('Please be sure the condition!');location.href="/register"</script>`);
    return;
  }

  // cript password
  password = bycrypt.hashSync(password, saltRounds);

  // connect to database
  var sqlQuery = `SELECT * FROM users WHERE uid = ?`;
  var sqlParams = [username];
  connection.query(sqlQuery, sqlParams, (err, results) => {
    if(err){
      console.log(err);
      res.send(`<script>alert('DB Connection Error!');location.href="/register"</script>`);
    }
    if(results.length > 0){
      res.send(`<script>alert('ID already exists!');location.href="/register"</script>`);
    }
    sqlQuery = `INSERT INTO users (uid, password, authority) VALUES (?, ?, ?)`;
    sqlParams = [username, password, 'user'];
    connection.query(sqlQuery, sqlParams,(err, results) => {
      if (err) {
        console.log(err);
        res.send(`<script>alert('DB Connection Error!');location.href="/register"</script>`);
        return;
      }
      console.log(results);
      res.send(`<script>alert("Register Success! Please Log In."); location.href="/"</script>`);
    });
  });
});

router.get('/logout', (req, res, next) => {
  res.clearCookie('sessionid');
  res.clearCookie('username');
  sessionStorage.deleteSession(req.cookies.username);
  res.redirect('/');
});

router.get('/mypage', (req, res, next) => {
  if(req.cookies.sessionid == sessionStorage.getSession(req.cookies.username)){
    res.render('mypage', Object.assign(viewsVariables, {authorized : true, username : req.cookies.username}));
    return;
  }

  res.redirect('/login');
});

router.post('/change_password', (req, res, next) => {
  var { new_password } = req.body;
  var { username } = req.cookies;
  new_password = bycrypt.hashSync(new_password, saltRounds);

  const sqlQuery = `UPDATE users SET password=? where uid=?;`;
  var sqlParams = [new_password, username];
  connection.query(sqlQuery, sqlParams, (err, results) => {
    if (err) {
      console.log(err);
      return;
    }
    res.send(`<script>alert("Change Password Success!"); location.href="/"</script>`);
  });
  
});

module.exports = router;

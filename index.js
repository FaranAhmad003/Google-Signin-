const express = require('express');
const path = require('path');
const app = express();
const passport = require('passport');
const session = require('express-session');

require('./auth');
app.use(express.json());
app.use(express.static(path.join(__dirname, 'client')));

function isLoggedin(req, res, next) {
  req.user ? next() : res.sendStatus(401);
}

app.get('/', (req, res) => {
  res.sendFile('index.html', { root: __dirname });
});

app.use(
  session({
    secret: 'mysecret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['email', 'profile'] })
);

app.get(
  '/auth/google/callback',
  passport.authenticate('google', {
    successRedirect: '/auth/protected',
    failureRedirect: '/auth/google/failure',
  })
);

app.get('/auth/protected', isLoggedin, (req, res) => {
  let name = req.user.displayName;
  console.log(`User ${name} logged in`);
  res.send(`Hello ${name}`);
});

app.get('/auth/google/failure', (req, res) => {
  res.send('Something went wrong');
});

app.listen(3000, () => {
  console.log('Listening on port 3000');
});

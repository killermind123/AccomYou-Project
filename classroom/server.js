const express = require('express');
const session = require('express-session');
const app = express();
const sessionOptions = {
  secret: 'yourSecretKey',
  resave: false,
  saveUninitialized: true,
};
  
app.use(session(sessionOptions));

app.get('/request', (req, res) => {
  if (req.session.count){
    req.session.count += 1;
  }else{
    req.session.count = 1;
  }

  res.send(`You have visited this page ${req.session.count} times`);
});

app.get('/register', (req, res) => {
 const {name='Annonymous'} = req.query;
 req.session.name=name;
 res.redirect('/greet');
});

app.get('/greet', (req, res) => {
  res.send(`Hello, ${req.session.name }`);
});

app.get('/get', (req, res) => {
  res.send('Hello, world!');
});


app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
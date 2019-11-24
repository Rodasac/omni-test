const express = require('express');
const path = require('path');
const helmet = require('helmet');
const session = require('express-session');
const bodyParser = require('body-parser');
const moongose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('./config');
const middleware = require('./middleware');

const PORT = process.env.PORT || 5000;

const MONGOURL = 'mongodb://127.0.0.1:27017/omnitest';

const app = express();

moongose.connect(MONGOURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('DB Connected'))
  .catch(error => console.log(error));

const { User } = require('./models/user');

const userAdmin = new User({ email: 'admin@admin', password: 'admin' });
userAdmin.save(function(err, user) {
  if (err) {
    console.log('User admin ya existe');
    return;
  }
  console.log(`User admin saved: ${user.email}`);
});

app
  .use(bodyParser.json())
  .use(helmet())
  .use(session({
    secret: 'C55DAf5687F8708B83f0912bd0638FC181727a0235f1e8C8B200F5F00539217E9110FE79925318a39E34c7e8A2DcB94Faf48d0068cCEE38fFf7D2747DeDA0F6c',
    name: 'sessionId',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
  }))
  .use(express.static(path.join(__dirname, '/client/dist')))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '/client/dist/index.html'));
});

app.post('/login', (req, res) => {
  User.findOne({'email': req.body.email}, (err, user) => {
    if (!user) return res.status(400).json({message: 'El usuario no existe'});

    user.comparePasswords(req.body.password, (err, isMatch) => {
      if(err) throw err;
      if(!isMatch) return res.status(400).json({
        success: false,
        message: 'Contraseña inválida!'
      });

      const token = jwt.sign({id: user.id, email: user.email},
        config.secret,
        {
          expiresIn: '24h' // expires in 24 hours
        }
      );

      res.status(200).json({
        success: true,
        message: 'Gracias por iniciar',
        user: {
          email: user.email
        },
        token: token
      });
    })
  });
});

app.post('/details', middleware.checkToken, (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Gracias por iniciar'
  });
});

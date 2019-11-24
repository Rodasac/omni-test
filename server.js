const express = require('express');
const path = require('path');
var fs = require('fs');
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

const { Campaign } = require('./models/campaigns');
const parse = require('csv-parse');

const output = [];

fs.readFile(path.join(__dirname, 'lipigas_2111.csv'), 'utf8', function(err, contents) {
  console.log(contents);

  parse(
    contents, {
    trim: true,
    skip_empty_lines: true,
    from_line: 2
  })
  .on('readable', function(){
    let record;
    while (record = this.read()) {
      output.push(record);
    }
  })
  .on('end', function(){
    for(let i = 0; i < output.length; i++) {
      const campaign = new Campaign({
        entity: output[i][0],
        date: new Date(parseInt(output[i][1], 10)),
        status: output[i][2],
        step: output[i][3],
        status_date: new Date(parseInt(output[i][4], 10))
      });

      campaign.save(function(err, camp) {
        if (err) {
          console.log(`La campaña ya existe`);
          return;
        }
        console.log(`Campaña: ${camp.entity}`);
      });
    }
  });
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

app.post('/login', (req, res) => {
  User.findOne({'email': req.body.email}, (err, user) => {
    if (!user) return res.status(200).json({
      success: false,
      emailErr: true,
      message: '¡El usuario no existe!'
    });

    user.comparePasswords(req.body.password, (err, isMatch) => {
      if(err) throw err;
      if(!isMatch) return res.status(200).json({
        success: false,
        passwordErr: true,
        message: '¡Contraseña inválida!'
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

app.get('/details', middleware.checkToken, (req, res) => {
  Campaign.find({}, (err, campaigns) => {
    if (err) return res.status(200).json({
      success: true,
      message: 'No se han encontrado campañas'
    });
    const campaignsAll = campaigns;

    res.status(200).json({
      success: true,
      message: 'Gracias por iniciar',
      campaigns: campaignsAll
    });
  });
});

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '/client/dist/index.html'));
});

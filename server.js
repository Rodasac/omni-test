const express = require('express');
const path = require('path');
const app = express();
const helmet = require('helmet');
const session = require('express-session')

const PORT = process.env.PORT || 5000;

app
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

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/client/dist/index.html'));
});

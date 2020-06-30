const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv/config');

//Middlewares
app.use(cors());
app.use(bodyParser.json());

//Import ROUTES
const postsRoute = require('./routes/posts');

app.use('/posts', postsRoute);

//ROUTES
app.get('/', (req, res) => {
    res.sendFile('index.html', { root: __dirname });
});

app.get('/registration', (req, res) => {
    res.sendFile('registration.html', { root: __dirname });
});

//Connect to DB
mongoose.connect(process.env.DB_CONNECTION, {
  useNewUrlParser: true,
  useUnifiedTopology: true
 },
() => console.log('connected to DB!')
);

//How do we listen
app.listen(3000, () => {
    console.log(`Server running at http://localhost:3000`);
});

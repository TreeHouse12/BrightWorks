const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressHbs = require('express-handlebars');
//const cors = require('cors');
const session = require('express-session');
require('dotenv/config');
const app = express();

//View Engine setup
app.engine('.hbs', expressHbs({defaultLayout: 'layout', extname: '.hbs'}));
app.set('view engine', '.hbs');

//Middlewares
//app.use(cors());
app.use(bodyParser.json());
app.use(session({secret:"asdfdffdf323rdcc",resave:false,saveUninitialized:true}));
//Import ROUTES
const routes = require('./routes/index');
const postsRoute = require('./routes/posts');

app.use('/', routes);
app.use('/posts', postsRoute);
app.use(express.static('public'));

//ROUTES
app.get('/', (req, res) => {
    res.sendFile('index.html', { root: __dirname });
});

app.get('/login', (req, res) => {
    res.sendFile('login.html', { root: __dirname });
});

app.get('/why_us', (req, res) => {
    res.sendFile('why_us.html', { root: __dirname });
});

app.get('/contact_us', (req, res) => {
    res.sendFile('contact_us.html', { root: __dirname });
});

app.get('/reviews', (req, res) => {
    res.sendFile('reviews.html', { root: __dirname });
});

app.get('/pricing', (req, res) => {
    res.render('pricing', { title: 'Shopping Cart' });
    //res.sendFile('pricing.html', { root: __dirname });
});

app.get('/registration', (req, res) => {
    res.sendFile('registration.html', { root: __dirname });
});

//app.get('/state', (req, res) => {
//    res.sendFile('state.js', { root: __dirname });
//});

//Connect to DB
mongoose.connect(process.env.DB_CONNECTION, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
 },
() => console.log('connected to DB!')
);

//How do we listen
app.listen(3000, () => {
    console.log(`Server running at http://localhost:3000`);
});

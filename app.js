const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressHbs = require('express-handlebars');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const Service = require('./models/service');
const Cart = require('./models/cart');
const validate = require('express-validator');
const MongoStore = require('connect-mongo')(session);
require('dotenv/config');
const app = express();
const Handlebars = require('handlebars');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')

//View Engine setup
app.engine('.hbs', expressHbs({defaultLayout: 'layout', extname: '.hbs', handlebars: allowInsecurePrototypeAccess(Handlebars)}));
app.set('view engine', '.hbs');

//Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(validate());
app.use(cookieParser());
app.use(session({
  secret:"asdfdffdf323rdcc",
  resave:false,
  saveUninitialized:false,
  store: new MongoStore({ mongooseConnection: mongoose.connection }),
  cookie: { maxAge: 180 * 60 * 1000 }
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next) {
  res.locals.login = req.isAuthenticated();
  res.locals.session = req.session;
  next();
});

//Import ROUTES
const userRoutes = require('./routes/user');
const routes = require('./routes/index');
const postsRoute = require('./routes/posts');

app.use('/user', userRoutes);
app.use('/', routes);
app.use('/posts', postsRoute);
app.use(express.static('public'));

//ROUTES
//app.get('/', (req, res) => {
//    res.sendFile('index.html', { root: __dirname });
//});

app.get('/login', (req, res) => {
    res.sendFile('login.html', { root: __dirname });
});

app.get('/why_us', (req, res) => {
    res.sendFile('why_us.html', { root: __dirname });
});

app.get('/residential', (req, res) => {
    res.sendFile('residential.html', { root: __dirname });
});

app.get('/contact_us', (req, res) => {
    res.sendFile('contact_us.html', { root: __dirname });
});

app.get('/reviews', (req, res) => {
    res.sendFile('reviews.html', { root: __dirname });
});

app.get('/add-to-cart/:id', (req, res) => {
   const serviceId = req.params.id;
   const cart = new Cart(req.session.cart ? req.session.cart : {});

   Service.findById(serviceId, function(err, service) {
      if (err) {
        return res.redirect('/');
      }
      cart.add(service, service.id);
      req.session.cart = cart;
      console.log(req.session.cart)
      res.redirect('/');
   });
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
require('./config/passport')

//How do we listen
app.listen(3000, () => {
    console.log(`Server running at http://localhost:3000`);
});

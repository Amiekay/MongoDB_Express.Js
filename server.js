const express = require('express');
const connectEnsureLogin = require('connect-ensure-login')
const {connectToMongoDB} = require('./db');
const app = express()
 require ('dotenv').config()
const PORT = process.env.PORT
const bookRoute =require('./routes/bookRoute')
const session  = require('express-session');
const passport = require('passport');
const userModel = require('./model/users')
const bodyParser = require('body-parser')
// connecting to mongodb instance
connectToMongoDB()

// Configure the app to use sessions
// Session is a way to store data on the server between requests
// so that we can access it on subsequent requests
// in this case, we are storing the authenticated user id for the duration of the session
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60 * 60 * 1000 } // 1 hour
}));

app.use(express.json());
app.use(express.urlencoded({extended: false}))
app.use(passport.initialize()); // initialize passport middleware
app.use(passport.session()); // use passport session middleware

passport.use(userModel.createStrategy()); // use the user model to create the strategy

// serialize and deserialize the user object to and from the session
passport.serializeUser(userModel.serializeUser());
passport.deserializeUser(userModel.deserializeUser());

app.set('views', 'views');
app.set('view engine', 'ejs');

//secure the /books route
app.use('/books',  connectEnsureLogin.ensureLoggedIn(), bookRoute);

// renders the home page
app.get('/',  (req, res) => {
    res.render('index');
});

// renders the login page
app.get('/login', (req, res) => {
    res.render('login');
});

// renders the signup page
app.get('/signup', (req, res) => {
    res.render('signup');
});

// handles the signup request for new users
app.post('/signup', (req, res) => {
    const user = req.body;
    userModel.register(new userModel({ username: user.username }), user.password, (err, user) => {
        if (err) {
            console.log(err);
            res.status(400).send(err);
        } else {
            passport.authenticate('local')(req, res, () => {
                res.redirect("/books")
            });
        }
    });
});


// handles the login request for existing users
app.post('/login', passport.authenticate('local', { failureRedirect: '/' }), (req, res) => {
    res.redirect('/books');
});

// handles the logout request
app.post('/logout', (req, res) => {
    req.logout(passport.logout, (err)=>{
res.send(err)
    });
    res.redirect('/');
});


//catch errors middleware
app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).send('Something broke!');
});

app.listen(PORT, ()=>{
    console.log(`server started susccesfully at http://localhost:${PORT}`)
})



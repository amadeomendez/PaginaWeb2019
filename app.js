const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bcrypt = require('bcryptjs');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const { ensureAuthenticated } = require('./config/auth');

const app = express();

require('./config/passport')(passport);

// Connect to database
mongoose.connect('mongodb+srv://user:1234@cluster0-tv0hq.mongodb.net/test?retryWrites=true&w=majority',
	{useNewUrlParser: true, useUnifiedTopology: true});
let db = mongoose.connection;
db.once('open', () => { console.log('Connected successfully to database'); });
db.on('error', (err) => { console.log(err); });

// Load models
//let EpisodeList = require('./models/episodelist');
let Season = require('./models/season');
let User = require('./models/User');

// Load view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Parse application/json and application/x-www-form-urlencoded
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

// Set public folder
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
	Season.find({}, (err, seasons) => {
		if (err) console.log(err);
		else res.render('index', { seasons: seasons });
	});
	/*let covers = [
		{url: "https://cdn.myanimelist.net/images/anime/5/79183l.jpg"},
		{url: "https://cdn.myanimelist.net/images/anime/7/72533l.jpg"},
		{url: "https://cdn.myanimelist.net/images/anime/1572/95010l.jpg"}
	];*/
});

app.get('/alphabeticlist', (req, res) => {
	Season.find({}, (err, seasons) => {
		if (err) console.log(err);
		else res.render('alphabeticList', { seasons: seasons });
	});
});

app.get('/genrelist', (req, res) => { res.render('genreList'); });

app.get('/searchpage', (req, res) => { res.render('searchPage'); });

app.get('/series/:id', (req, res) => {
  Season.findById(req.params.id, (err, series) => {
    if (err) console.log(err);
    else res.render('profile', { series: series });
  });
});

app.get('/userList', (req, res) => { res.render('userList'); });

app.get('/search/', (req, res) => {
	Season.find({}, (err, seasons) => {
		if (err) console.log(err);
		else res.send(seasons);
	});
});

app.get('/search/:query', (req, res) => {
	Season.find({ name: RegExp(req.params.query, 'i') }, (err, seasons) => {
		if (err) console.log(err);
		else res.send(seasons);
	});
});

app.get('/dashboard', ensureAuthenticated, (req, res) =>
  res.render('userDashboard', {
    user: req.user
  })
);

app.get('/user', (req, res) => { res.render('userScreen'); });

app.get('/login', (req, res) => { res.render('loginScreen'); });

app.get('/register', (req, res) => { res.render('registerScreen'); });

// Register
app.post('/register', (req, res) => {
  const { name, email, password, password2 } = req.body;
  let errors = [];

  if (!name || !email || !password || !password2) {
    errors.push({ msg: 'Please enter all fields' });
  }

  if (password != password2) {
    errors.push({ msg: 'Passwords do not match' });
  }

  if (password.length < 6) {
    errors.push({ msg: 'Password must be at least 6 characters' });
  }

  if (errors.length > 0) {
    res.render('registerScreen');
  } else {
    User.findOne({ email: email }).then(user => {
      if (user) {
        errors.push({ msg: 'Email already exists' });
        res.render('registerScreen');
      } else {
        const newUser = new User({
          name,
          email,
          password
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => {
                res.redirect('/login');
              })
              .catch(err => console.log(err));
          });
        });
      }
    });
  }
});

// Login
app.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/login',
    failureFlash: true
  })(req, res, next);
});

// Logout
app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/login');
});


// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => { console.log(`Listening on port ${PORT}.`); })

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

// Connect to database
mongoose.connect('mongodb+srv://user:1234@cluster0-tv0hq.mongodb.net/test?retryWrites=true&w=majority',
	{useNewUrlParser: true, useUnifiedTopology: true});
let db = mongoose.connection;
db.once('open', () => { console.log('Connected successfully to database'); });
db.on('error', (err) => { console.log(err); });

// Load models
//let EpisodeList = require('./models/episodelist');
let Season = require('./models/season');

// Load view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Parse application/json and application/x-www-form-urlencoded
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

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

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => { console.log(`Listening on port ${PORT}.`); })

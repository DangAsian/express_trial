const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const expressValidator = require("express-validator");
const flash = require("connect-flash");
const session = require("express-session");

mongoose.connect("mongodb://localhost/nodekb");
let db = mongoose.connection;

//Check connection
db.once("open", () => {
  console.log("Connected to MongoDB");
});
//Check for DB errors
db.on("error", err => {
  console.log(err);
});

//Init App
const app = express();

//Bring in Models
let Article = require("./models/article");

//Load View Engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

//Body parser middlewear
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

//Set Public Folder
app.use(express.static(path.join(__dirname, 'public')));

//Express Session middlewear

app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
}))
//Express Message MiddleWear
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

//Express Validator
app.use(express.json());
app.post('/user', (req, res) => {
  User.create({
    username: req.body.username,
    password: req.body.password
  }).then(user => res.json(user));
});

//Routes
//Home Route
app.get("/", (req, res) => {
  Article.find({}, (err, articles) => {
    if (err) {
      console.log(err);
    } else {
      res.render("index", {
        title: "Article",
        articles: articles
      });
    }
  });
});

//Add Route
app.get("/articles/add", (req, res) => {
  res.render("add_article", { title: "Add article" });
});

//Add Submit POST Route
app.post("/articles/add", (req, res) => {
  req.checkBody('title', 'Title is required').notEmpty();
  req.checkBody('author', 'Author is required').notEmpty();
  req.checkBody('body', 'Body is required').notEmpty();
  // Get Errors
  let errors = req.validationErrors();

  if(errors) {
    res.render('add_article'), {

    }
  }
  let article = new Article();
  article.title = req.body.title;
  article.author = req.body.author;
  article.body = req.body.body;
  article.save(err => {
    if (err) {
      console.log(err);
      return;
    } else {
      res.redirect('/');
    }
  });
});

//Edit Single Article
app.get("/article/edit/:id", (req, res) => {
  Article.findById(req.params.id, (err, article)=>{
    res.render('edit_article', {title: 'Edit Article', article: article})
  })
})

//Update Submit POST Route
app.post("/article/edit/:id", (req, res) => {

  let article = {};

  article.title = req.body.title;
  article.author = req.body.author;
  article.body = req.body.body;

  let query = {_id:req.params.id}

  Article.update(query, article, (err) => {
    if (err) {
      console.log(err);
      return;
    } else {
      req.flash('danger', 'Article Updated')
      res.redirect('/');
    }
  });
});

//Get Single Article
app.get("/article/:id", (req, res) => {
  Article.findById(req.params.id, (err, article)=>{
    res.render('article', {article: article})
  })
})

//Call Listen Function
//Start Server
app.listen(3000, () => {
  console.log("Server Started on port 3000...");
});

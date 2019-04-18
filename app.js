const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
var bodyParser = require("body-parser");

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
  console.log(req.body)
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

//Call Listen Function
//Start Server
app.listen(3000, () => {
  console.log("Server Started on port 3000...");
});

"use strict"
const express = require("express");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");

const app = express();
const PORT = process.env.PORT || 8080;

var urlDatabase = {
  "b2xVn2": {
      longURL: "http://www.lighthouselabs.ca", 
      visits: 0, 
      uniques: 0, 
      dateCreated: '2016-10-27 11:30:00'
    },
  "9sm5xK": {longURL: "http://www.google.com", visits: 0, uniques: 0, dateCreated: '2016-10-26 15:43:23'}
};

//This is where you would put user data
var users = {

};

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded());
app.use(methodOverride("_method"));

function generateRandomString() {
  // http://stackoverflow.com/questions/1349404/generate-a-string-of-5-random-characters-in-javascript
  return Math.random().toString(36).substring(2,8);
}

app.get("/", (req, res) => {
  res.end("Hello!");
});

app.get("/hello", (req, res) => {
  res.end("<html><body>Hello <b>World</b></body></html>\n\n");
});

app.get("/urls", (req, res) => {
  let templateData = { urls: urlDatabase };
  res.render("urls_index", templateData);
});

app.post("/urls", (req, res) => {
  let shortURL = generateRandomString();
  let newURL = {
    longURL: req.body.longURL,
    visits: 0,
    uniques: 0,
    dateCreated: Date.now()
  };
  urlDatabase[shortURL] = newURL;
  
  res.redirect("/urls");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls/:id", (req, res) => {
  let shortURL = req.params.id;
  let templateVars = {
    shortURL: shortURL,
    urlData: urlDatabase[shortURL]
  };
  res.render("urls_show", templateVars);
});

app.get("/urls/:id/delete", (req, res) => {
  let shortURL = req.params.id;
  delete urlDatabase[shortURL];
  res.redirect("/urls");
});

app.put("/urls/:id", (req, res) => {
  let shortURL = req.params.id;
  let longURL = req.body.longURL;
  urlDatabase[shortURL].longURL = longURL;
  res.redirect("/urls/"+shortURL);
});

app.get("/u/:shortURL", (req, res) => {
  let shortURL = req.params.shortURL;
  let urlData = urlDatabase[shortURL];
  urlData.visits++;
  //if cookie existed and did not have shortURL in it OR no cookie
  //urlData.uniques++;
  //update user's cookie to make sure there IS a cookie and it has our shortURL in it
  urlDatabase[shortURL] = urlData; 
  res.redirect(302, urlData.longURL);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

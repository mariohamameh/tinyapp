const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

const bodyParser = require("body-parser");

function generateRandomString() {
    const minVal = 35 ** 5;
    const randomVal = Math.floor(Math.random() * minVal) + minVal;
    return randomVal.toString(35);
}
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.get('/', (req, res) => {   
    
    res.redirect('/urls'); 
});
app.post("/urls", (req, res) => {
    //console.log(req.body); Log the POST request body to the console
    let shortURL = generateRandomString();
    urlDatabase[shortURL] = {longURL: req.body.longURL}; 
    res.redirect(`/urls/${shortURL}`);
});
const urlDatabase = {
    "b2xVn2":{longURL: "http://www.lighthouselabs.ca"},
    "9sm5xK":{longURL: "http://www.google.com"}
    
};
app.get("/urls", (req, res) => {
    const templateVars = { urls: urlDatabase};
    res.render("urls_index", templateVars);
});
app.get("/urls/new", (req, res) => {
    const templateVars = {urls: urlDatabase}
    res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
    const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL]["longURL"] };
    res.render("urls_show", templateVars);
});
app.get("/u/:shortURL", (req, res) => {
    const longURL = urlDatabase[req.params.shortURL].longURL;
    res.redirect(longURL);
    
  });

app.get("/urls.json", (req, res) => {
    res.json(urlDatabase);
});
app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}!`);
});


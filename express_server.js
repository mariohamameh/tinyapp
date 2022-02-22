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

app.post("/urls", (req, res) => {
    console.log(req.body);  // Log the POST request body to the console
    res.send('ok');         // Respond with 'Ok' (we will replace this)
});

const urlDatabase = {
    "b2xVn2": "http://www.lighthouselabs.ca",
    "9sm5xK": "http://www.google.com"
};
app.get("/urls", (req, res) => {
    const templateVars = { urls: urlDatabase };
    res.render("urls_index", templateVars);
});

app.get("/urls", (req, res) => {
    const templateVars = { urls: urlDatabase };
    res.render("urls_show", templateVars);
});

app.get("/urls/new", (req, res) => {
    res.render("urls_new");
});

app.get("/urls/:shortURL", (req, res) => {
    const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase/* What goes here? */ };
    res.render("urls_show", templateVars);
});

app.get("/", (req, res) => {
    res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
    res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
    res.send("<html><body>Hello <b>Mario</b></body></html>\n");
});

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}!`);
});
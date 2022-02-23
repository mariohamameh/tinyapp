const express = require("express");
const cookieParser = require('cookie-parser')
const app = express();
app.use(cookieParser())


const PORT = 8080; // default port 8080

const bodyParser = require("body-parser");
const { name } = require("ejs");
const { set } = require("express/lib/application");

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
    const templateVars = { 
        username: req.cookies["username"],
        urls: urlDatabase};
    res.render("urls_index", templateVars);
});
app.get("/urls/new", (req, res) => {
    const templateVars = {urls: urlDatabase}
    res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
    const templateVars = {shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL]["longURL"] };
    res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
    const longURL = urlDatabase[req.params.shortURL].longURL;
    res.redirect(longURL);
    
});
app.post("/urls/:shortURL/delete", (req, res) => {
    delete urlDatabase[req.params.shortURL];
    res.redirect("/urls");
});
app.post("/urls/:shortURL/edit", (req, res) => {

    res.redirect(`/urls/${req.params.shortURL}`);
    
});
app.get("/login", (req, res) => {
    const templateVars = { 
        username: req.cookies['username'],
    }
    res.render('login', templateVars);

});
app.get("/logout", (req, res) => {
    const templateVars = { 
        username: req.cookies['username'],
    }
    res.render('logout', templateVars);

});

app.post('/logout', (req, res) => {
    res.clearCookie('username');
    res.redirect('/urls');
})    
app.post('/login', (req,res) => {
    res.cookie('username', req.body.username);
    const templateVars = { 
        username: req.cookies['username'],
        urls: urlDatabase};
    res.redirect("/urls");

})

app.get("/urls.json", (req, res) => {
    res.json(urlDatabase);
});
app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}!`);
});


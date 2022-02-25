const express = require("express");
//const cookieParser = require('cookie-parser')
const cookieSession = require('cookie-session')
const bcrypt = require('bcrypt');
const app = express();
//app.use(cookieParser())
app.use(cookieSession({
    name: 'session',
    keys: ['MARIO']
  }))

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
const users = { 
    "userRandomID": {
      id: "userRandomID", 
      email: "user@example.com", 
      password: "purple-monkey-dinosaur"
    },
   "user2RandomID": {
      id: "user2RandomID", 
      email: "user2@example.com", 
      password: "dishwasher-funk"
    }
  };

const findUserByEmail = function(email){
    for(let userID in users) {
        if (users[userID].email === email) {
            return users[userID];
        }
    }
}  

app.post("/register", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    if (!password || !email) {
        res.send('404');
    } else if (findUserByEmail(email)){
        res.send('404');
    } else {
        const user_id = generateRandomString();
        const hashedPassword = bcrypt.hashSync(password, 10);
        const user = {
         email : email,
         id : user_id,    
         password : hashedPassword  
        };
        users[user_id] = user;
        
        req.session.user_id = user_id;
        res.redirect('/urls');
    }

})  
app.get("/urls", (req, res) => {
    const templateVars = { 
        user: users[req.session['user_id']],
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
app.get("/register", (req, res) => {
    
    res.render('register');

});
app.get("/login", (req, res) => {
    const templateVars = { 
        user : null,
    }
    res.render('login', templateVars);

});
app.get("/logout", (req, res) => {
    const templateVars = { 
        user_id: req.session['user_id'],
    }
    res.render('logout', templateVars);

});

app.post('/logout', (req, res) => {
    req.session = null;
    res.redirect('/urls');
})    
app.post('/login', (req,res) => {
    const email = req.body.email;
    const password = req.body.password;
    const user = findUserByEmail(email);
    console.log("user ", user);
    if (!findUserByEmail(email)){
        res.send('403');
    } else if (!bcrypt.compareSync(password, findUserByEmail(email).password)){
        res.send('403');
    } else {    
        req.session.user_id = user.id;
        res.redirect("/urls");
    }

})

app.get("/urls.json", (req, res) => {
    res.json(urlDatabase);
});
app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}!`);
});


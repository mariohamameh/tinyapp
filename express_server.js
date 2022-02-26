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
    if (req.session.user_id){
        let shortURL = generateRandomString();
        urlDatabase[shortURL] = {longURL: req.body.longURL,
        userID: req.session.user_id}; 
        console.log('app.post(/urls) urlDatabase ', urlDatabase);
        res.redirect('/urls');
    } else {
        console.log(' you can not create new url');
        res.redirect('/urls');
    }

    
});
const urlDatabase = {
    //"b2xVn2":{longURL: "http://www.lighthouselabs.ca"},
    //"9sm5xK":{longURL: "http://www.google.com"}
    
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

const findUserByEmail = function(email, database){
    for (let id in database) {
        if (database[id].email === email) {
          return database[id];
        }
    }
}  

app.post("/register", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    if (!password || !email) {
        res.send('404');
    } else if (findUserByEmail(email, users)){
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
const urlsForUser = function(userID) {
    const output = {};
    for (let shortURL in urlDatabase) {
        if (urlDatabase[shortURL].userID === userID) {
            output[shortURL] = urlDatabase[shortURL].longURL;       
        }
    }
    return output;
} 
app.get("/urls", (req, res) => {
    const userUrls = urlsForUser(req.session['user_id']);
    console.log('app.get(/urls) userUrls ', userUrls);
    const templateVars = { 
        user: users[req.session['user_id']],
        urls: userUrls};
    res.render("urls_index", templateVars);
});
app.get("/urls/new", (req, res) => {
    const templateVars = {
        user: users[req.session['user_id']],
        urls: urlDatabase};
    res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
    const templateVars = {shortURL: req.params.shortURL, 
        longURL: urlDatabase[req.params.shortURL]["longURL"],
        user: users[req.session['user_id']],
    
    };
    res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
    if (urlDatabase[req.params.shortURL]) {
        const longURL = urlDatabase[req.params.shortURL].longURL;
        if (longURL === undefined) {
          res.status(302);
        } else {
          res.redirect(longURL);
        }
      } else {
        res.status(404).send("404");
      }    
});
app.post("/urls/:shortURL/delete", (req, res) => {
    delete urlDatabase[req.params.shortURL];
    res.redirect("/urls");
});
app.post("/urls/:shortURL/edit", (req, res) => {
  const userID = req.session.user_id;
  const shortURL = req.params.shortURL;
  const userUrls = urlsForUser(userID, urlDatabase);
  const templateVars = { urlDatabase, userUrls, shortURL, user: users[userID] };
  if (!urlDatabase[shortURL]) {
    const errorMessage = 'This short URL does not exist.';
    res.status(404).render('urls_error', {user: users[userID], errorMessage});
  } else if (!userID || !userUrls[shortURL]) {
    const errorMessage = 'You are not authorized to see this URL.';
    res.status(401).render('urls_error', {user: users[userID], errorMessage});
  } else {
    res.render('urls_show', templateVars);
  }
});
app.get("/register", (req, res) => {
    const templateVars = { 
        user : null,
    }
    res.render("register", templateVars);

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
    const user = findUserByEmail(email, users);
    console.log("user ", user);
    if (!findUserByEmail(email, users)){
        res.send('no such email 403');
    } else if (!bcrypt.compareSync(password, findUserByEmail(email, users).password)){
        res.send('passwords dont match 403');
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


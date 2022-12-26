// --- generic css imports are here --- //
import './App.css';
import './css/Layout.css';
import './css/Home.css'

// --- image imports are here --- //
import LoginPageLogo from './components/LoginPageLogo.png';
import LoginPageLogo2 from './components/LoginPageLogo2.png';

import LoginLogo from './components/LoginLogo.png';
import SignupLogo from './components/SignupLogo.png';
import PasswordLogo from './components/PasswordLogo.png';
import UsernameLogo from './components/UsernameLogo.png';
import PhoneArt from './components/PhoneArt.png';

// --- web page imports are here --- //
import {Home} from './pages/Home.js';
import {Search} from './pages/Search.js';
import {Settings} from './pages/Settings.js';
import {MakePayment} from './pages/MakePayment.js';

// --- react import is here --- //
import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

var array2d = [];
var current_user;

function App() {

  // --- login and registration begins here on initial load up --- //
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [firstname, setFirstname] = React.useState('');
  const [lastname, setLastname] = React.useState('');
  const [bio, setBio] = React.useState('');
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [signUpPressed, setSignUpPressed] = React.useState(false);

  // --- expressions to switch between login and register are here --- //
  const displaySignUp = () => {
    setSignUpPressed(true);
  }
  const displayLogin = () => {
    setSignUpPressed(false);
  }
  const getTransactionHistory = () => {
    const settings = {
      method: 'post'
    }
    fetch('/getMyInfo', settings)
      .then(res => res.json())
      .then(data => {
        // this logic is for displaying a transaction feed
        current_user = data.username;
        array2d = stringTo2dArray(data.myTransactions, '/', "|");
        loadTransactionFeed();
      })
      .catch(e => console.log(e));
  };

  // --- nav bar & baseline page structure is here --- //
  if (isLoggedIn) {
    return (
      <div id='grid-container'>
        <Router>

          {/* this displays the nav */}
          <div id='grid-stack'>
              <div id='stack-item'> 
                  <Link to="/"><button id='link' onClick={() => { getTransactionHistory() } }>Home</button></Link>
              </div>
              <div id='stack-item'> 
                  <Link to="/make_payment"><button id='link'>Pay</button></Link>
              </div>
              <div id='stack-item'> 
                  <Link to="/search"><button id='link'>Search</button></Link>
              </div>
              <div id='stack-item'> 
                  <Link to="/settings"><button id='link'>Settings</button></Link>
              </div>
              <form>
                <div id='stack-item'> 
                  <button id='link'>Logout</ button>
                </div>
              </form>
          </div>

          {/* This displays the users basic info when logged in */}
          <div id='page-layout'>
            

          {/* this gets the page contents */}
              <Switch>
                  <Route path="/search">
                      <Search />
                  </Route>
                  <Route path="/make_payment">
                      <MakePayment />
                  </Route>
                  <Route path="/settings">
                      <Settings />
                  </Route>

                  {/* The '/' will set default Route to Home Page */}
                  <Route path="/">
                      <Home />
                  </Route>
              </Switch>
          </div>
        </Router>   
    </div>
  );
}

function validateUser() {
  if (firstname.indexOf('/') > -1 || firstname.indexOf('|') > -1) {
    return false
  }
  if (lastname.indexOf('/') > -1 || lastname.indexOf('|') > -1) {
    return false
  }
  if (username.indexOf('/') > -1 || username.indexOf('|') > -1) {
    return false
  }
  return true;
}

//New handler for new User
const NewUserSubmit = () => {
  if (validateUser()) {
    // run logic to create this user
  const body = {
    username: username,
    password: password,
    firstname: firstname,
    lastname: lastname,
    bio: bio
  };
  const settings = {
    method: 'post',
    body: JSON.stringify(body),
  };
  fetch('/new', settings)
    .then(res => res.json())
    .then(data => {
      if (data.isLoggedIn) {
        setIsLoggedIn(true);
        getTransactionHistory();
      } else if (data.error) {
        setError(data.error);
      }
    })
    .catch(e => console.log(e));
  }
  else {
    setError("Cannot user '/' or '|' characters.")
  }
  };








// --- expression to insert data to backend --- //
  const handleSubmit = () => {
  const body = {
    username: username,
    password: password,
    // firstname: firstname,
    // lastname: lastname,
    // bio: bio
  };
  const settings = {
    method: 'post',
    body: JSON.stringify(body),
  };
  fetch('/logIn', settings)
    .then(res => res.json())
    .then(data => {
      if (data.isLoggedIn) {
        setIsLoggedIn(true);
        getTransactionHistory();
      } else if (data.error) {
        setError(data.error);
      }
    })
    .catch(e => console.log(e));
  };

  // --- html for login and registration is here --- //
  if(!signUpPressed) {
    return (
    <div id='sign-up'>
      <img id='image-container' src={LoginPageLogo} /> {/**Login page logo */}
      <div id='sign-up-stack'>
        <div><input placeholder='Username' id='input' value={username} onChange={e => setUsername(e.target.value)} /></div>
        <div><input placeholder='Password' id='input' type="password" value={password} onChange={e => setPassword(e.target.value)} /></div>
        
        <div><button id='input' onClick={handleSubmit}>Login</button></div>
        <div>Don't have an account? <u><a id='hyperlink' onClick={displaySignUp}>Sign up</a></u></div>
        
        <div>{error}</div>
        <img src={PhoneArt} />
      </div>
    </div>
    );
  }
  else {
    return (
      <div id='sign-up'>
        <img id='image-container' src={LoginPageLogo2}/>
        <div id='sign-up-stack'>
          <h1>  Sign Up  </h1>
          <div><input id='input' placeholder='First name' value={firstname} onChange={e => setFirstname(e.target.value)} />
          <input id='input' placeholder='Last name' value={lastname} onChange={e => setLastname(e.target.value)} /></div>
          <div><input id='input' placeholder='Username' value={username} onChange={e => setUsername(e.target.value)} />
          <input id='input' placeholder='Password' type="password" value={password} onChange={e => setPassword(e.target.value)} /></div>
          <div><textarea id='input-textarea' placeholder='Bio' value={bio} onChange={e => setBio(e.target.value)} /></div>
          <div><button id='register' onClick={NewUserSubmit}>Register Now </button>
          Already have an account? <u><a id='hyperlink' onClick={displayLogin}>Login</a></u></div>
          <div>{error}</div>
        </div>
      </div>
      );
  }
}

var child = document.createElement("div");

// have back end return an array of all of the users transactions, then loop through it to render the transaction divs
function loadTransactionFeed() {
  var size = array2d.length;
  var i = size - 2;

  // to: array2d[i][1]     from: array2d[i][2]    notes: array2d[i][3]     amount: array2d[i][4]      balance: array2d[i][5]
  
  // if 'to' field matches user, then we will display a gain
  if (current_user === array2d[i][1]) {
    child.innerHTML = `<div id='flex-item'> <div id='item'><fieldset><span><label 
    id='name'>Payment Recieved From: @${array2d[i][2]}</label></span><br></br>
    <label id='username'>Amount Transfered: $ +${array2d[i][4]}</label> 
    <div id="balance">$ ${array2d[i][5]}</div> <button id='bio-button'>
    <div id='bio-text'>${array2d[i][3]}</div></button>
    </fieldset></div></div>`
  }

  // if 'to' field does not match user, then we will display a loss
  else {
    child.innerHTML = `<div id='flex-item'> <div id='item'><fieldset><span><label 
    id='name'>Payment Sent To: @${array2d[i][1]}</label></span><br></br>
    <label id='username'>Amount Transfered: $ -${array2d[i][4]}</label>
    <div id="balance">$ ${array2d[i][5]}</div><button id='bio-button'>
    <div id='bio-text'>${array2d[i][3]}</div></button></fieldset></div></div>`
  }

  i--;

  while (i > 0) {
        // if 'to' field matches user, then we will display a gain
    if (current_user === array2d[i][1]) {
      child.innerHTML += `<div id='flex-item'> <div id='item'><fieldset><span><label 
      id='name'>Payment Recieved From: @${array2d[i][2]}</label></span><br></br>
      <label id='username'>Amount Transfered: $ +${array2d[i][4]}</label>
      <div id="balance">$ ${array2d[i][5]}</div><button id='bio-button'>
      <div id='bio-text'>${array2d[i][3]}</div></button></fieldset></div></div>`
      
  }

  // if 'to' field does not match user, then we will display a loss
    else {
      child.innerHTML += `<div id='flex-item'> <div id='item'><fieldset><span><label 
      id='name'>Payment Sent To: @${array2d[i][1]}</label></span><br></br>
      <label id='username'>Amount Transfered: $ -${array2d[i][4]}</label>
      <div id="balance">$ ${array2d[i][5]}</div><button id='bio-button'>
      <div id='bio-text'>${array2d[i][3]}</div></button></fieldset></div></div>`
  }
    
    i--;
  }

  document.getElementById("home_layout").appendChild(child);
}

function stringTo2dArray(string, d1, d2) {
  return string.split(d1).map(function(x){return x.split(d2)});
}

export default App;
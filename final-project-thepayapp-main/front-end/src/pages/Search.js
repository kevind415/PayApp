import '../css/Search.css';

import React from 'react';

export function Search() {

  // --- Attributes to be used for switching between displays. --- //
  const [username, setUsername] = React.useState('');
  const [payButtonPressed, setPayButtonPressed] = React.useState(false);
  const [foundUser, setFoundUser] = React.useState(false);

  // --- Attributes to be used for transactions --- //
  const [to, setTo] = React.useState('');
  // const [paymentType, setPaymentType] = React.useState('');
  const [notes, setNotes] = React.useState('');
  const [amount, setAmount] = React.useState('');
  const [error, setError] = React.useState('');

  // --- Setter expressions for switching between displays. --- //
  const displayPayPage = () => {
    removeUser();
    setPayButtonPressed(true);
    setTo(username);
  }
  const displaySearchPage = () => {
      setPayButtonPressed(false);
      setFoundUser(false);
      setUsername("");
  }

  function validateNotes() {
    if (notes.indexOf('/') > -1 || notes.indexOf('|') > -1) {
        return false;
      }
      return true;
  }

  // --- This will process a transaction if user decides to pay a searched user --- //
  const makeTransaction = () => {
    if (validateNotes()) {
      const body = {
      to : to,
      // paymentType : paymentType,
      notes: notes,
      amount: amount
    };
    const settings = {
      method: 'post',
      body: JSON.stringify(body),
    };
    fetch('/makeTransaction', settings)
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setError(data.error);
        }
        else {
          displaySearchPage();
          setError("Payment sent.");
        }
      })
      .catch(e => console.log(e));
    } else {
      setError("Cannot use '/' or '|' characters.")
    }
    
  };

  // --- This creates a search feed. Only one person can be queried at a time. --- //
  const create_search_feed = () => {
    const body = {
      username: username,
    };
    const settings = {
      method: 'post',
      body: JSON.stringify(body),
    };
    fetch('/findUser', settings)
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          if (child != null) {
            removeUser();
          }
          setError("");
          setFoundUser(true);
          loadUser(data.firstname, data.lastname, username, data.bio);
        }
        else {
          setFoundUser(false);
          setError("No users found.");
        }
      })
      .catch(e => console.log(e));
    };

    // --- This diplays an empty search page. --- //
    if (!foundUser) {
          return (
      <div id='layout'>
        <div id='flex-item'>
          <div id='item'>
            <label id='title'>Search for User</label>
            <div id="search_form">
              <button id="search_button" onClick={() => { create_search_feed() } }>
                <svg id="search_icon" viewBox="0 0 1024 1024">
                    <path class="path1" d="M848.471 928l-263.059-263.059c-48.941 36.706-110.118 
                    55.059-177.412 55.059-171.294 0-312-140.706-312-312s140.706-312 312-312c171.294 0 312 140.706 312 312 0 
                    67.294-24.471 128.471-55.059 177.412l263.059 263.059-79.529 79.529zM189.623 408.078c0 121.364 97.091 218.455
                    218.455 218.455s218.455-97.091 218.455-218.455c0-121.364-103.159-218.455-218.455-218.455-121.364 0-218.455 
                    97.091-218.455 218.455z"></path>
                 </svg>
              </button>

              <input type="text" placeholder="Search username" id = "search_bar"  onChange={e => setUsername(e.target.value)}></input>
            </div>
          </div>
        </div>
        <div>{error}</div>
      </div>
    ); 
    }

    // --- This diplays found user information. --- //
    else if (!payButtonPressed) {
      return (
        <div id='layout'>
          <div id='flex-item'>
            <div id='item'>
              <label id='title'>Search</label>
              <div id="search_form">
                <button id="search_button" onClick={() => { create_search_feed() } }>
                  <svg id="search_icon" viewBox="0 0 1024 1024">
                      <path class="path1" d="M848.471 928l-263.059-263.059c-48.941 36.706-110.118 
                      55.059-177.412 55.059-171.294 0-312-140.706-312-312s140.706-312 312-312c171.294 0 312 140.706 312 312 0 
                      67.294-24.471 128.471-55.059 177.412l263.059 263.059-79.529 79.529zM189.623 408.078c0 121.364 97.091 218.455
                      218.455 218.455s218.455-97.091 218.455-218.455c0-121.364-103.159-218.455-218.455-218.455-121.364 0-218.455 
                      97.091-218.455 218.455z"></path>
                   </svg>
                </button>
  
                <input type="text" placeholder="Business, name, username" id = "search_bar"  onChange={e => setUsername(e.target.value)}></input>
                <button id='pay-button' onClick={displayPayPage}>Pay</button>
              </div>
            </div>
          </div>
          <div>{error}</div>
        </div>
      ); 
      }

      // --- This diplays payment page with found user. --- //
    else {
      return (
        <div class ="grid-item">
            <div class="hello">
                <h3 id ="funnyFont"> Make Payment </h3>
                <input type = "text" placeholder="Enter amount" onChange={e => setAmount(e.target.value)} class="input-styling"></ input>
                <span id = "hi"></span>
                <input type =" text"  placeholder="Send payment to" class="input-styling" value={username} onChange={e => setTo(e.target.value)}></ input>
                <textarea  id="input-textarea" placeholder='Enter your message here...' onChange={e => setNotes(e.target.value)}></textarea> 
                <button class="button-style" onClick={displaySearchPage}>Go Back</button>
                <button class="button-style" onClick={makeTransaction}>Send payment</button>
            </div>
            <div>{error}</div>
        </div>
    );
    }
  }

  // --- The logic here will create or remove child nodes from parent layout --- //
  var child = document.createElement("div");
  function removeUser() {
    child.remove();
  }

  function loadUser(firstname, lastname, username, bio)
  {
    child.innerHTML = `<div id='flex-item'><div id='item'><fieldset><span><label 
    id='name'>${firstname} ${lastname}</label>
    </span><br></br><label id='username'>@${username}</label><button id='bio-button'>
    <div id='bio-text'>${bio}</div></button></fieldset>
    </div></div>`

    document.getElementById("layout").appendChild(child);
  }
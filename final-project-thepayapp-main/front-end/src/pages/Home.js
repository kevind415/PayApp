import '../css/Home.css'
import React from "react";

export function Home() {
  const [username, setUsername] = React.useState('');
  const [firstname, setFirstname] = React.useState('');
  const [lastname, setLastname] = React.useState('');
  const [balance, setBalance] = React.useState('');

  const getMyInfo = () => {
    const settings = {
      method: 'post'
    }
    fetch('/getMyInfo', settings)
      .then(res => res.json())
      .then(data => {
        // this logic will update basic information on front end in case it changed.
        setBalance(data.balance);
        setFirstname(data.firstname);
        setLastname(data.lastname);
        setUsername(data.username);
      })
      .catch(e => console.log(e));
  };

  getMyInfo();

    return (
             <div id='home_layout'>
               
              <div id='flex-item'>
                
                <div id='item'>
                  <fieldset>
                    <span><label id='name'>Welcome!  {firstname} {lastname}</label></span>
                    <br></br>
                    <label id='username'>User ID: {username}</label>
                    <div id="balance">Available Balance: $ {balance}</div>
                  </fieldset>
                  <label id='title'>Transactions</label>
                </div>
                
              </div>
            </div>
    );
  }

  
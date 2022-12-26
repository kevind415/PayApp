import '../css/Settings.css';

import React from 'react';

// import { current_user } from '../App';
export function Settings() {

    const [password, setPassword] = React.useState('');
    const [firstname, setFirstname] = React.useState('');
    const [lastname, setLastname] = React.useState('');
    const [bio, setBio] = React.useState('');
    const [bankName, setBankName] = React.useState('');
    const [amount, setAmount] = React.useState('');
    const [error, setError] = React.useState('');

    function validateUser() {
        if (firstname.indexOf('/') > -1 || firstname.indexOf('|') > -1) {
          return false
        }
        if (lastname.indexOf('/') > -1 || lastname.indexOf('|') > -1) {
          return false
        }
        return true;
      }
    

    const getMyInfo = () => {
        const settings = {
          method: 'post'
        };
        fetch('/getMyInfo', settings)
          .then(res => res.json())
          .then(data => {
            //set all fields retrieved from user
            setPassword(data.password);
            setFirstname(data.firstname);
            setLastname(data.lastname);
            setBio(data.bio);
            setBankName(data.bankName);
          })
          .catch(e => console.log(e));
     };
    

    // updates account info after pressing 'update account' button
    const updateAccount = () => {
        if (validateUser()) {
            const body = {
            firstname: firstname,
            lastname: lastname,
            password: password,
            bio: bio,
            bankName : bankName
        };
        const settings = {
            method: 'post',
            body: JSON.stringify(body)
        };
        fetch('/updateAccount', settings)
            .catch(error => console.log(error));
            
            // empty fields and displayed 'updated' message
            setFirstname("");
            setLastname("");
            setBankName("");
            setBio("");
            setPassword("");
            setError("Successfully updated.");
        } 
        
        else {
            setError("Cannot user '/' or '|' characters.")
        }

    };

    // updates the users balance after pressing 'transfer' button
    const updateBalance = () => {
        const body = {
            amount : amount
        };
        const settings = {
            method: 'post',
            body: JSON.stringify(body)
        };
        fetch('/updateBalance', settings)
            .then(res => res.json())
            .then(data => {
                if (data.error) {
                    setError(data.error);
                }
                else {
                    setAmount("");
                    setError("Transaction complete.");
                }
            })
            .catch(error => console.log(error));
    };

    // this will update all the fields to reflect the current user logged in
  
        return (
            
        <div class ="grid-item">

            <div class="hello">
                
                    <h3> <p> Update Information </p>  </h3>
                    <br></br>
                    <input placeholder='First name' type = "text" class="input-styling" value= {firstname} onChange={e => setFirstname(e.target.value)}/>
                    <span id = "hi" ></span>
                    <br></br>

                    <input placeholder='Last name' class="input-styling" type = "text" value= {lastname} onChange={e => setLastname(e.target.value)}/>
                    <span id = "mail"   ></span>
                    <br></br>

                    <input placeholder='Password' class="input-styling" type = "text" id="words" value={password} onChange={e => setPassword(e.target.value)}/>
                    <span id = "word2"  ></span>
                    <br></br>

                    
                    <input placeholder='My bank' class="input-styling" type = "text" id="word" value={bankName} onChange={e => setBankName(e.target.value)}/>
                    <span id = "word1" ></span>
                    <br></br>

                    
                    <textarea placeholder='Bio' id="input-textarea" value={bio} onChange={e => setBio(e.target.value)}/>
                    <span id = "word1" ></span>
                    <br></br>

                    <button class="button-style" onClick={() => { updateAccount() } }>Update Account</button>
                    <button class="button-style" onClick={() => { getMyInfo() } }>Get My Info</button>
                
            </div>

            <div class="container2">
                

                    <h3> <p> Transfer to the pay app </p>  </h3>

                    <input placeholder='$ 0' value={amount} onChange={e => setAmount(e.target.value)}/>

                    <button class="button-style" onClick={() => { updateBalance() } }> Transfer </button>    

                    {/* <button type = "submit" class="button-style">Submit</button> */}
                    
            </div>

            <div>{error}</div>

        </div>
    );
  }
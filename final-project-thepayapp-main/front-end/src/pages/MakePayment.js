import '../css/MakePayment.css';
import React from 'react';

export function MakePayment() {
      // --- Attributes to be used for transactions --- //
  const [to, setTo] = React.useState('');
//   const [paymentType, setPaymentType] = React.useState('');
  const [notes, setNotes] = React.useState('');
  const [amount, setAmount] = React.useState('');
  const [error, setError] = React.useState('');

  function validateNotes() {
    if (notes.indexOf('/') > -1 || notes.indexOf('|') > -1) {
        return false;
      }
      return true;
  }
    
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
              setError("Payment sent.");
              setAmount("");
              setNotes("");
              setTo("");
            }
          })
          .catch(e => console.log(e));
        } else {
            setError("Cannot use '/' or '|' characters.")
        }
      };

    return (

        <div class ="grid-item">
            <div class="hello">
                    <h3 id ="funnyFont"> Make Payment </h3>
                    <input type = "text" class="input-styling" placeholder="Enter amount" value={amount} onChange={e => setAmount(e.target.value)}></ input>
                    <span id = "hi"></span>
                    <input type =" text"  placeholder="Send payment to" class="input-styling" value={to} onChange={e => setTo(e.target.value)}></ input>
                    <textarea  id="input-textarea" placeholder='Enter your message here...' value={notes} onChange={e => setNotes(e.target.value)}></textarea> 
                    <button  class="button-style" onClick={makeTransaction}>Send payment</button>
            </div>

            <div>{error}</div>

        </div>
    );
  }
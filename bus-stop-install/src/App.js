import logo from './logo.svg';
import './App.css';
import Search from './components/Search';
import React, {useState} from 'react';
import {BrowserRouter as Router, Route, Link} from 'react-router-dom';

const notificationIcon = require('./assets/notification.svg')
const signInIcon = require('./assets/login.svg')

function App() {
  let token = '';  
  const fullHash = document.location.hash.split('#')[1];
  if (fullHash) {
      const params = JSON.parse('{"' + decodeURI(fullHash).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}');
      token = params.access_token
  }
  
  const getToken = () => {
    var redirectUri = 'http://127.0.0.1:3000/';
    var clientID = 'ClUjM15qkXs1GSHA';

    window.location.href = 'https://metroas08.metrostlouis.org/arcgis/sharing/rest/oauth2/authorize?client_id=' + clientID + '&response_type=token&redirect_uri=' + window.encodeURIComponent(redirectUri) + 'oauth-window' +'height=400,width=600,menubar=no,location=yes,resizable=yes,scrollbars=yes,status=yes';
    
  } 

  return (
    <Router>
      <div className="App">
        <div id="top-bar" class="w-100 flex">
            {/* <button id="notification" class="w-20  center items-center">
                <img src={notificationIcon} alt='notification' ></img>
            </button> */}

            <button id="sign-in" class="w-20  center items-center " onClick={getToken}>
                <img id="sign-in-icon" src={signInIcon} alt='signin' />
            </button>
        </div>
        <div id="explain" class="ph2 tc">
            <h3 class='tc center helvetica w-100'>Bus Stop Assessment App</h3>
            <p class="ct center w-100 helvetica w-100">Search for a bus stop to get started</p>
        </div>
        {token == '' ? <div><h1>You need to sign in</h1></div> : <Search token={token} />}
      </div>
    </Router>
  );
}

export default App;

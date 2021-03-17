import logo from './logo.svg';
import './tachyons.min.css';
import './App.css';
import Search from './components/Search';
import React, {useState, useEffect} from 'react';
import loginIcon from './assets/login.svg';
import axios from 'axios';

function App() {
  const [signedIn, setSignedIn] = useState(false);
  const [user, setUser] = useState('');
  const [token, setToken] = useState('');
  
  const load = () => {
    const fullHash = document.location.hash.split('#')[1];

    if (fullHash) {
      const params = JSON.parse('{"' + decodeURI(fullHash).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}');
      setSignedIn(true);
      setUser(params.username.replace('%40','@'));
      return params.access_token
    } else {
      return '';
    }
  };
  
  const getToken = () => {
    var redirectUri = 'http://127.0.0.1:3000/';
    var clientID = 'ClUjM15qkXs1GSHA';
    window.location.href = 'https://metroas08.metrostlouis.org/arcgis/sharing/rest/oauth2/authorize?client_id=' + clientID + '&response_type=token&redirect_uri=' + window.encodeURIComponent(redirectUri) + 'oauth-window' +'height=400,width=600,menubar=no,location=yes,resizable=yes,scrollbars=yes,status=yes';
  };

  useEffect(() => {
    setToken(load());

  })
  

  return (
      <div className="App">
        <div id="top-bar" class="w-100 flex">
            <h3>{signedIn ? user : '' }</h3>

            <button id="sign-in" class="w-20 items-center ml-auto" onClick={getToken}>
                <img id="sign-in-icon" src={loginIcon} alt='signin' />
            </button>
        </div>
        <div id="explain" class="ph2 tc">
            <h3 class='tc center helvetica w-100'>Bus Stop Install App</h3>
            <p class="ct center w-100 helvetica w-100">Search for a bus stop to get started</p>
        </div>
        {signedIn ? <Search token={token} /> : <div><h1>You need to sign in</h1></div>}
      </div>
  );
}

export default App;

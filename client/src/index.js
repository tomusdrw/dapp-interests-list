import './index.html';

const web3 = global.web3;
if (!web3) {
  throw new Error('Web3 instance is expected to be provided from outside.');
}

import ReactDOM from 'react-dom';
import React from 'react';

import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
const muiTheme = getMuiTheme({});
import injectTapEventPlugin from 'react-tap-event-plugin';
// Needed for onTouchTap, for material ui
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

import Web3Provider from './components/Web3Provider';
import Home from './components/Home';

ReactDOM.render(
  <Web3Provider web3={web3}>
    <MuiThemeProvider muiTheme={muiTheme}>
      <Home />
    </MuiThemeProvider>
  </Web3Provider>,
  document.querySelector('#app')
);

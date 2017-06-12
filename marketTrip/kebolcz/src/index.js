var React = require('react');
var { render } = require('react-dom');
var { createStore, applyMiddleware } = require('redux');
var { Provider } = require('react-redux');
var thunk = require('redux-thunk').default;
var App = require('./js/App');
var reducer = require('./reducers');

let createStoreWithMiddleware = applyMiddleware(thunk)(createStore)

let store = createStoreWithMiddleware(reducer);

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
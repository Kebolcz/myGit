import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Login from './container/login/login';
import Register from './container/register/register';
import AuthRoute from './conponent/authroute/authroute';
import reducers from './reducer';
import './config';
import registerServiceWorker from './registerServiceWorker';

import './index.css';

const store = createStore(
	reducers,
	compose(applyMiddleware(thunk), window.devToolsExtension ? window.devToolsExtension() : (f) => f)
);
console.log(reducers);

function Boss(){
	return <h2>boss</h2>
}

function Genius(){
	return <h2>Genius</h2>
}

ReactDOM.render(
	<Provider store={store}>
		<BrowserRouter>
			{/* <Switch> */}
			<div>
				<AuthRoute />
				<Route path="/login" component={Login} />
				<Route path="/register" component={Register} />
				<Route path="/boss" component={Boss} />
				<Route path="/genius" component={Genius} />
			</div>
			{/* </Switch> */}
		</BrowserRouter>
	</Provider>,
	document.getElementById('root')
);
registerServiceWorker();

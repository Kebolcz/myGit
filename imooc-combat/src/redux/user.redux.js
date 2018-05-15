import axios from 'axios';
import { getRedirectPath } from '../util';

const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
const REGISTER_SUCCESS = 'REGISTER_SUCCESS';
const ERROR_MSG = 'ERROR_MSG';

const initState = {
	user: '',
	pwd: '',
	type: '',
	isAuth: false,
	msg: '',
	redirectTo: ''
};

//reducer
export function user(state = initState, action) {
	switch (action.type) {
		case REGISTER_SUCCESS:
			return { ...state, msg: '', redirectTo: getRedirectPath(action.payload), isAuth: true, ...action.payload };
		case LOGIN_SUCCESS:
			return { ...state, msg: '', redirectTo: getRedirectPath(action.payload), isAuth: true, ...action.payload };
		case ERROR_MSG:
            return { ...state, msg: action.msg, isAuth: false};
		default:
			return state;
	}
}

// actionCreater
function registerSuccess(data) {
	return { type: REGISTER_SUCCESS, payload: data };
}

function loginSuccess(data) {
	return { type: LOGIN_SUCCESS, payload: data};
}

function errorMsg(msg) {
	return { msg, type: ERROR_MSG };
}

export function register({ user, pwd, repeatpwd, type }) {
	if (!user || !pwd || !type) {
		return errorMsg('user pwd is required!');
	}

	if (pwd !== repeatpwd) {
		return errorMsg('pwd is not the same!');
	}
	return (dispatch) => {
		var params = new URLSearchParams();
		params.append('user', user);
		params.append('repeatpwd', repeatpwd);
		params.append('type', type);
		params.append('pwd', pwd);
		axios.post('/user/register', params).then((res) => {
			if (res.status === 200 && res.data.code === 0) {
				dispatch(registerSuccess({ user, pwd, type }));
			} else {
				dispatch(errorMsg(res.data.msg));
			}
		});
	};
}

export function login({ user, pwd}) {
	if(!user || !pwd){
		return errorMsg('用户名和密码必须输入！');
	}

	return (dispatch) => {
		var params = new URLSearchParams();
		params.append('user', user);
		params.append('pwd', pwd);
		axios.post('/user/login', params).then((res) => {
			if (res.status === 200 && res.data.code === 0) {
				dispatch(loginSuccess(res.data.data));
			} else {
				dispatch(errorMsg(res.data.msg));
			}
		});
	};
}
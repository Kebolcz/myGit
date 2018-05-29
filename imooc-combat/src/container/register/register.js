import React from 'react';
import Logo from '../../conponent/logo/logo';
import { List, InputItem, WingBlank, WhiteSpace, Button, Radio } from 'antd-mobile';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { register } from '../../redux/user.redux';

class Register extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			user: '',
			pwd: '',
			repeatpwd: '',
			type: 'genuis'
		};
	}
	handleChange(key, val) {
		this.setState({
			[key]: val
		});
	}
	handleRegister(){
		this.props.register(this.state);
		// console.log(this.state);
	}
	render() {
		const RadioItem = Radio.RadioItem;
		return (
			<div>
				{ this.props.state.redirectTo ? <Redirect to={this.props.state.redirectTo}/> : null }
				<Logo />
				<WingBlank>
					<List>
						{this.props.state.msg ? <p className="error-msg">{this.props.state.msg}</p> : null}
						<InputItem onChange={(v) => { this.handleChange('user', v); }}>user</InputItem>
						<WhiteSpace />
						<InputItem type='password' onChange={(v) => { this.handleChange('pwd', v); }}>pwd</InputItem>
						<WhiteSpace />
						<InputItem type='password' onChange={(v) => { this.handleChange('repeatpwd', v); }}>rptpwd</InputItem>
						<WhiteSpace />
						<RadioItem checked={this.state.type === 'genuis'} onChange={() => this.handleChange('type','genuis')}>Genuis</RadioItem>
						<WhiteSpace />
						<RadioItem checked={this.state.type === 'boss'} onChange={() => this.handleChange('type','boss')}>Boss</RadioItem>
						<WhiteSpace />
						<Button type="primary" onClick={() => this.handleRegister()}>注册</Button>
					</List>
				</WingBlank>
			</div>
		);
	}
}

const mapStateToProps = state => {
	return {
		state: state.user
	};
};
  
const actionCreator = { register };
  
Register = connect(mapStateToProps, actionCreator)(Register);

export default Register;

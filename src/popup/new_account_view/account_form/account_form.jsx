import React from 'react'
import { connect } from 'react-redux'
import { newAccount } from 'lib/store/actions'

import PassField from './pass_field'

class AccountForm extends React.Component {
  constructor (props) {
    super(props);
    this.state = { password: '', confirmation: '' }
  }
  
  handleChange (e) {
    this.setState({ [e.target.name]: e.target.value });
  }
  
  handleSubmit (e) {
    e.preventDefault();
    this.props.dispatch(newAccount(this.state.password));
  }
  
  handleBlur (e) {
    const name = e.target.name;

    if (!this.state[name]) {
      this.setState({ [`${name}Error`]: `${name} cannot be empty.` });
      return;
    } 

    if (name == 'confirmation' && !this.passMatch()) {
      this.setState({ confirmationError: 'password and confirmation do not match.' });
      return;
    }
    
    this.setState({ confirmationError: '', passwordError: ''});
  }
  
  passMatch () {
    return this.state.confirmation == this.state.password;
  }
  
  shouldBeDisabled () {
    return (this.state.password == '' || !this.passMatch());
  }
  
  render () {
    return (
      <form className="account-form" onSubmit={ this.handleSubmit.bind(this) }>

        <PassField name="password"
                   value={ this.state.password }
                   onChange={ this.handleChange.bind(this) }
                   onBlur={ this.handleBlur.bind(this) }
                   error={ this.state.passwordError } />

        <PassField name="confirmation"
                   value={ this.state.confirmation }
                   onChange={ this.handleChange.bind(this) }
                   onBlur={ this.handleBlur.bind(this) }
                   error={ this.state.confirmationError } />

        <button disabled={ this.shouldBeDisabled() }>Create</button>
      </form>
    )
  }
}

export default connect()(AccountForm)

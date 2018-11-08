import React from 'react'
import { connect } from 'react-redux'
import { newAccount } from 'lib/store/actions'

import PassField from './pass_field'

class AccountForm extends React.Component {
  constructor (props) {
    super(props);
    this.state = { pass: '', confirm: '' }
  }
  
  handleChange (e) {
    this.setState({ [e.target.name]: e.target.value });
  }
  
  handleSubmit (e) {
    e.preventDefault();
  }
  
  handleBlur (e) {
    const name = e.target.name;

    if (!this.state[name]) {
      this.setState({ [`${name}Error`]: `${name} cannot be empty.` });
      return;
    } 

    if (name == 'confirm' && !this.passMatch()) {
      this.setState({ confirmError: 'Password and confirmation do not match.' });
      return;
    }
    
    this.setState({ confirmError: '', passError: ''});
  }
  
  passMatch () {
    return this.state.confirm == this.state.pass;
  }
  
  shouldBeDisabled () {
    return (this.state.pass == '' || !this.passMatch());
  }
  
  render () {
    return (
      <form className="account-form" onSubmit={ this.handleSubmit.bind(this) }>

        <PassField name="pass" value={ this.state.pass } onChange={ this.handleChange.bind(this) } onBlur={ this.handleBlur.bind(this) } error={ this.state.passError } />
        <PassField name="confirm" value={ this.state.confirm } onChange={ this.handleChange.bind(this) } onBlur={ this.handleBlur.bind(this) } error={ this.state.confirmError } />

        <button disabled={ this.shouldBeDisabled() }>Create</button>
      </form>
    )
  }
}

export default connect()(AccountForm)

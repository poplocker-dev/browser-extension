import React from 'react'
import { connect } from 'react-redux'
import { newAccount } from 'lib/store/actions'
import PassField from './pass_field'
import PassMeter from './pass_meter'

class AccountForm extends React.Component {
  constructor (props) {
    super(props);

    this.state    = { password: '', confirmation: '', passwordError: '', confirmationError: '' }
    this.pristine = { passwordError: '', confirmationError: '' }
    this.handlers = {
      onChange: (e) => {
        const { name, value } = e.target;

        this.setState({ [name]: value }, () => {
          if (name == 'confirmation' && !this.passMatch())
            this.setState({ confirmationError: 'password and confirmation do not match' });
          else
            this.setState(this.pristine);
        });
      },

      onBlur: (e) => {
        const name = e.target.name;

        if (!this.state[name]) {
          this.setState({ [`${name}Error`]: `${name} cannot be empty` });
          return;
        }
        this.setState(this.pristine);
      }
    }
  }

  handleSubmit (e) {
    e.preventDefault();
    this.props.dispatch(newAccount(this.state.password));
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
                   label="Password"
                   value={this.state.password}
                   error={this.state.passwordError}
                   {...this.handlers} />

        <PassField name="confirmation"
                   label="Confirm Password"
                   value={this.state.confirmation}
                   error={this.state.confirmationError}
                   {...this.handlers} />

        <PassMeter measure={this.state.password} />

        <button className="btn create-account-btn" disabled={ this.shouldBeDisabled() }>Create</button>
      </form>
    )
  }
}

export default connect()(AccountForm)

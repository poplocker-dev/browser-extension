import React                 from 'react'
import { connect }           from 'react-redux'
import { Button, PassField } from '@poplocker/react-ui'
import PassMeter             from './pass_meter'

import { account, save } from 'lib/storage'
import { accountGenerated, accountReady, accountFailed } from 'lib/store/actions'

import './account_form.css'

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

    this.props.dispatch(accountGenerated());
    account.generate(this.state.password).then(save)
      .then(() => this.props.dispatch(accountReady()))
      .catch(() => this.props.dispatch(accountFailed()))
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
                   autoFocus={true}
                   value={this.state.password}
                   error={this.state.passwordError}
                   {...this.handlers} />

        <PassField name="confirmation"
                   label="Confirm Password"
                   value={this.state.confirmation}
                   error={this.state.confirmationError}
                   {...this.handlers} />

        <PassMeter measure={this.state.password} />
        <Button icon="human" disabled={ this.shouldBeDisabled() }>Create Account</Button>
      </form>
    )
  }
}

export default connect()(AccountForm)

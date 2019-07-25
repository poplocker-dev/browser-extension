import React         from 'react'
import { PassField } from '@poplocker/react-ui'
import PassMeter     from './pass_meter'

class PassConfirm extends React.Component {
  constructor (props) {
    super(props);

    this.state    = { password: '', confirmation: '', passwordError: '', confirmationError: '' }
    this.handlers = {
      onChange: (e) => {
        const { name, value } = e.target;

        this.setState({ [name]: value }, () => {
          const passwordError = name == 'password'? '' : this.state.passwordError;
          if (!this.passMatch()) {
            this.props.onUpdatePassword('');
            this.setState({ passwordError, confirmationError: this.state.confirmation? 'password and confirmation do not match' : this.state.confirmationError });
          } else {
            this.props.onUpdatePassword(this.state.password);
            this.setState({ passwordError, confirmationError: '' });
          }
        });
      },

      onBlur: (e) => {
        const name = e.target.name;

        if (!this.state[name]) {
          this.setState({ [`${name}Error`]: `${name} cannot be empty` });
          return;
        }
      }
    }
  }

  passMatch () {
    return this.state.confirmation == this.state.password;
  }

  render () {
    return (
      <>
        <PassField name="password"
                   label={this.props.passwordLabel || "Password"}
                   autoFocus={this.props.autoFocus}
                   value={this.state.password}
                   error={this.state.passwordError}
                   {...this.handlers} />
        <PassField name="confirmation"
                   label={this.props.confirmationLabel || "Confirm Password"}
                   value={this.state.confirmation}
                   error={this.state.confirmationError}
                   {...this.handlers} />
        <PassMeter measure={this.state.password} />
      </>
    )
  }
}

export default PassConfirm

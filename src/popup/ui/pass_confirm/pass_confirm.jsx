import React         from 'react'
import { PassField } from '@poplocker/react-ui'
import PassMeter     from './pass_meter'

class PassConfirm extends React.Component {
  constructor (props) {
    super(props);

    this.state    = { password: '', confirmation: '', passwordError: '', confirmationError: '' }
    this.pristine = { passwordError: '', confirmationError: '' }
    this.handlers = {
      onChange: (e) => {
        const { name, value } = e.target;

        this.setState({ [name]: value }, () => {
          if (!this.passMatch()) {
            this.props.onUpdatePassword('');
            if (name == 'confirmation')
              this.setState({ confirmationError: 'password and confirmation do not match' });
          } else {
            this.props.onUpdatePassword(this.state.password);
            this.setState(this.pristine);
          }
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

  passMatch () {
    return this.state.confirmation == this.state.password;
  }

  render () {
    return (
      <>
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
      </>
    )
  }
}

export default PassConfirm

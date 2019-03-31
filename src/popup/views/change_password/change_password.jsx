import React                 from 'react'
import { connect }           from 'react-redux'
import Header                from 'ui/header'
import { Button, PassField } from '@poplocker/react-ui'
import { changePassword }    from 'lib/rpc/account'
import PassConfirm           from 'ui/pass_confirm'

import { accountReady } from 'lib/store/actions'

import './change_password.css'

class ChangePasswordView extends React.Component {
  constructor (props) {
    super(props);

    this.state = { currentPassword: '', currentPasswordError: '', newPassword: '' }
  }

  onCurrentPasswordChange (e) {
    this.setState({ currentPassword: e.target.value });
    if (e.target.value)
      this.setState({ currentPasswordError: '' });
  }

  onCurrentPasswordBlur (e) {
    if (!this.state.currentPassword)
      this.setState({ currentPasswordError: 'password cannot be empty' });
  }

  onUpdateNewPassword (newPassword) {
    this.setState({ newPassword });
  }

  handleSubmit (e) {
    e.preventDefault();

    changePassword(this.state.currentPassword, this.state.newPassword)
      .then(() => this.props.dispatch(accountReady()))
      .catch(() => {
        this.setState({ currentPasswordError: 'wrong password' });
      })
  }

  shouldBeDisabled () {
    return this.state.currentPassword == '' || this.state.newPassword == '';
  }

  render () {
    return (
      <div className="change-password-view view">
        <Header caption="Change password on this device" />
        <form className="change-password-form" onSubmit={ this.handleSubmit.bind(this) }>
          <PassField name="current password"
                     label="Current Password"
                     autoFocus={true}
                     value={this.state.currentPassword}
                     error={this.state.currentPasswordError}
                     onChange={ this.onCurrentPasswordChange.bind(this) }
                     onBlur={ this.onCurrentPasswordBlur.bind(this) }/>
          <PassConfirm passwordLabel="New Password"
                       confirmationLabel="Confirm New Password"
                       onUpdatePassword={ this.onUpdateNewPassword.bind(this) } />
          <Button icon="human" disabled={ this.shouldBeDisabled() }>Change Password</Button>
        </form>
      </div>
    )
  }
}

export default connect()(ChangePasswordView)

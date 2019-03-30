import React          from 'react'
import { connect }    from 'react-redux'
import { Button }     from '@poplocker/react-ui'
import { newAccount } from 'lib/rpc/account'
import PassConfirm    from 'ui/pass_confirm'

import { accountGenerated, accountReady, accountFailed } from 'lib/store/actions'

import './account_form.css'

class AccountForm extends React.Component {
  constructor (props) {
    super(props);

    this.state = { password: '' }
  }

  onUpdatePassword (password) {
    this.setState({ password });
  }

  handleSubmit (e) {
    e.preventDefault();

    this.props.dispatch(accountGenerated());
    newAccount(this.state.password)
      .then(() => this.props.dispatch(accountReady()))
      .catch(() => this.props.dispatch(accountFailed()))
  }

  shouldBeDisabled () {
    return this.state.password == '';
  }

  render () {
    return (
      <form className="account-form" onSubmit={ this.handleSubmit.bind(this) }>
        <PassConfirm onUpdatePassword={ this.onUpdatePassword.bind(this) } />
        <Button icon="human" disabled={ this.shouldBeDisabled() }>Create Account</Button>
      </form>
    )
  }
}

export default connect()(AccountForm)

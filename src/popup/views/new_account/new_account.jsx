import React          from 'react'
import { connect }    from 'react-redux'
import Header         from 'ui/header'
import PassConfirm    from 'ui/pass_confirm'
import { Button }     from '@poplocker/react-ui'
import { newAccount } from 'lib/rpc/account'

import { accountGenerated, accountReady, accountFailed } from 'lib/store/actions'

import './new_account.css'

class NewAccount extends React.Component {
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
      <div className="new-acount-view view">
        <Header caption="Create new account on this device" />
        <form className="account-form" onSubmit={ this.handleSubmit.bind(this) }>
          <PassConfirm autoFocus={true}
                       onUpdatePassword={ this.onUpdatePassword.bind(this) } />
          <Button icon="human" disabled={ this.shouldBeDisabled() }>Create Account</Button>
        </form>
      </div>
    )
  }
}

export default connect()(NewAccount)

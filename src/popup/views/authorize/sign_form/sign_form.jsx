import React                                  from 'react'
import toBN                                   from 'number-to-bn'
import { connect }                            from 'react-redux'
import { Button, PassField }                  from '@poplocker/react-ui'
import { signTransaction, cancelTransaction } from 'lib/store/actions'

import './sign_form.css'

class SignForm extends React.Component {
  constructor (props) {
    super(props);
    this.state = { password: '' };
  }

  render () {
    return (
      <form className="tx-sign-form" onSubmit={this.props.handleSubmit.bind(this)}>

        <PassField label="Password"
                   onChange={this.handleChange.bind(this)}
                   autoFocus={true}
                   disabled={noFunds(this.props.transaction)}
                   value={this.state.password}
                   error={this.props.error}/>

        <div className="row">
          <Button icon="arrow" type="reject" onClick={this.props.handleCancel.bind(this)}>Cancel</Button>
          <Button icon="tick" disabled={this.shouldBeDisabled()}>Authorize</Button>
        </div>
      </form>
    )
  }

  handleChange (e) {
    this.setState({ password: e.target.value });
  }

  shouldBeDisabled () {
    return this.state.password.length == 0 || noFunds(this.props.transaction);
  }
}

const noFunds = (tx) => {
  const { balance, fee } = tx.pricing;
  const value            = toBN(tx.pending.current.params.value || 0);

  return balance.lt(value.add(fee));
}

const noFundsError = (tx) => {
  return noFunds(tx) ? 'Not enough funds.' : false;
}

const mapStore = ({ transaction, errors }) => {
  return {
    transaction,
    error: errors.txSign || noFundsError(transaction) || null,
  }
}

const mapDispatch = (dispatch) => ({
  handleSubmit: function (e) {
    e.preventDefault();

    const { gasPrice, gasEstimate } = this.props.transaction.pricing;
    const tx = {...this.props.transaction.pending.current.params, gasPrice, gasLimit: gasEstimate }

    dispatch(signTransaction(tx, this.state.password));
  },

  handleCancel: function (e) {
    e.preventDefault();
    dispatch(cancelTransaction());
  }
});

export default connect(mapStore, mapDispatch)(SignForm);

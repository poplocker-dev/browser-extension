import React                 from 'react'
import toBN                  from 'number-to-bn'
import { connect }           from 'react-redux'
import { toHex }             from 'lib/helpers'
import { Button, PassField } from '@poplocker/react-ui'
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
                   tabIndex={1}
                   autoFocus
                   disabled={noFunds(this.props.transaction)}
                   value={this.state.password}
                   error={this.props.error}/>

        <div className="row">
          <Button tabIndex={-1}
                  type="button"
                  icon="close"
                  kind="reject"
                  onClick={this.props.handleCancel.bind(this)}>
            Reject
          </Button>
          <Button autoFocus={true}
                  icon="tick"
                  disabled={this.shouldBeDisabled()}>
            Authorize
          </Button>
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

// TODO: move it to <Total/>
const noFunds = (tx) => {
  const { balance, fee } = tx.pricing;
  const value            = toBN(tx.pending.current.params.value || 0);

  // TODO: fix this with null initial values
  if (balance.eq(toBN(0)) && fee.eq(toBN(0)))
    return false;

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

    const gasPrice    = toHex(this.props.transaction.pricing.gasPrice);
    const gasEstimate = toHex(this.props.transaction.pricing.gasEstimate);

    const tx = {...this.props.transaction.pending.current.params, gasPrice, gasLimit: gasEstimate }

    dispatch(signTransaction(tx, this.state.password));
  },

  handleCancel: function (e) {
    e.preventDefault();
    dispatch(cancelTransaction());
  }
});

export default connect(mapStore, mapDispatch)(SignForm);

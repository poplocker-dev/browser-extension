import React                 from 'react'
import toBN                  from 'number-to-bn'
import { connect }           from 'react-redux'
import { toHex }             from 'lib/helpers'
import { Button, PassField } from '@poplocker/react-ui'
import { signTransaction,
         cancelTransaction,
         toggleAdvanced } from 'lib/store/actions'

import './sign_form.css'

class SignForm extends React.Component {
  constructor (props) {
    super(props);
    this.state = { password: '', showAdvanced: false };
  }

  render () {
    return (
      <form className="tx-sign-form" onSubmit={this.props.handleSubmit.bind(this)}>

        <div className="row">
          <PassField label="Password"
                     onChange={this.handleChange.bind(this)}
                     tabIndex={1}
                     autoFocus
                     disabled={noFunds(this.props.transaction)}
                     value={this.state.password}
                     error={this.props.error}/>
        </div>

        <div className="row show-advanced">
          <Button type="button" kind="light" icon="arrow"
                  tabIndex={-1}
                  onClick={this.props.handleAdvanced.bind(this)}>
            { this.props.advancedMode? 'Hide Advanced' : 'Show Advanced' }
          </Button>
        </div>

        <div className="row buttons">
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

const mapStore = ({ transaction, errors, advancedMode }) => {
  return {
    transaction,
    advancedMode,
    error: errors.txSign || noFundsError(transaction) || null,
  }
}

const mapDispatch = (dispatch) => ({
  handleSubmit: function (e) {
    e.preventDefault();

    const gasPrice    = toHex(this.props.transaction.pricing.gasPrice);
    const gasEstimate = toHex(this.props.transaction.pricing.gasEstimate);

    const { txId } = this.props.transaction.pending.current;
    const tx = {...this.props.transaction.pending.current.params, gasPrice, gasLimit: gasEstimate }

    dispatch(signTransaction(tx, this.state.password, txId));
  },

  handleCancel: function (e) {
    e.preventDefault();
    dispatch(cancelTransaction());
  },

  handleAdvanced: function () { dispatch(toggleAdvanced()) }
});

export default connect(mapStore, mapDispatch)(SignForm);

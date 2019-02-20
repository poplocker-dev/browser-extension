import React                 from 'react'
import { connect }           from 'react-redux'
import { toHex }             from 'lib/helpers'
import { Button, PassField } from '@poplocker/react-ui'

import { signTransaction, cancelTransaction, toggleAdvanced } from 'lib/store/actions'

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
                     disabled={this.props.noFunds}
                     value={this.state.password}
                     error={this.props.error}/>
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
    return this.state.password.length == 0 || this.props.noFunds
  }
}

const mapStore = ({ tx, errors, advancedMode }) => {
  return {
    tx,
    advancedMode,
    noFunds: errors.noFunds,
    error: errors.txSign || errors.txInfo || errors.noFunds || null
  }
}

const mapDispatch = (dispatch) => ({
  handleSubmit: function (e) {
    e.preventDefault();

    const gasPrice    = toHex(this.props.tx.pricing.gasPrice);
    const gasEstimate = toHex(this.props.tx.pricing.gasEstimate);
    const params      = {...this.props.tx.current.params, gasPrice, gasLimit: gasEstimate};
    const { txId, blockNonce } = this.props.tx.current;

    dispatch(signTransaction(params, txId, blockNonce, this.state.password));
  },

  handleCancel: function (e) {
    e.preventDefault();
    dispatch(cancelTransaction());
  },

  handleAdvanced: function () { dispatch(toggleAdvanced()) }
});

export default connect(mapStore, mapDispatch)(SignForm);

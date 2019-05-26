import React                 from 'react'
import { connect }           from 'react-redux'
import { toHex }             from 'lib/helpers'
import { signTx, cancelTx }  from 'lib/rpc/transaction'
import { Button, PassField } from '@poplocker/react-ui'

import { getLatestNonce }               from 'lib/rpc/eth_node'
import { toggleAdvanced, txSignFailed } from 'lib/store/actions'

import './sign_form.css'

class SignForm extends React.Component {
  constructor (props) {
    super(props);
    this.state = { password: '', showAdvanced: false };
  }

  render () {
    return (
      <form className="tx-sign-form" onSubmit={this.props.handleSubmit.bind(this)}>

        <div className="row show-advanced">
          <Button type="button" kind="light" icon="settings"
                  tabIndex={-1}
                  disabled={this.props.errors.txInfo}
                  onClick={this.props.handleAdvanced.bind(this)}>
            { this.props.advancedMode? 'Hide Advanced' : 'Show Advanced' }
          </Button>
        </div>

        <div className="row">
          <PassField label="Password"
                     onChange={this.handleChange.bind(this)}
                     tabIndex={1}
                     autoFocus={true}
                     disabled={this.props.errors.noFunds || this.props.errors.txInfo}
                     value={this.state.password}
                     error={this.props.passError}/>
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
    return !this.props.tx.pricing || this.state.password.length == 0 || this.props.errors.noFunds || !this.props.lockerValid
  }
}

const mapStore = ({ tx, errors, advancedMode, locker }) => {
  return {
    tx,
    advancedMode,
    errors,
    lockerValid: locker.status == 'simple' || locker.status == 'smart',
    passError: errors.txSign || errors.txInfo || errors.noFunds || null
  }
}

const mapDispatch = (dispatch) => ({
  handleSubmit: function (e) {
    e.preventDefault();

    const gasPrice    = toHex(this.props.tx.pricing.gasPrice);
    const gasEstimate = toHex(this.props.tx.pricing.gasEstimate);
    const params      = {...this.props.tx.current.params, gasPrice, gasLimit: gasEstimate};

    getLatestNonce()
      .then(blockNonce => signTx(params, this.props.tx.current.txId, blockNonce.result, this.state.password))
      .then(window.close)
      .catch(e => dispatch(txSignFailed(e)));
  },

  handleCancel: function (e) {
    e.preventDefault();
    cancelTx(this.props.tx.current.txId).then(window.close);
  },

  handleAdvanced: function () { dispatch(toggleAdvanced()) }
});

export default connect(mapStore, mapDispatch)(SignForm);

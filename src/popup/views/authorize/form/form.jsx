import React                 from 'react'
import { connect }           from 'react-redux'
import { signTransaction }   from 'lib/store/actions'
import { cancelTransaction } from 'lib/store/actions'
import Button                from 'ui/button'
import PassField             from 'ui/pass_field'

import './form.css'

class TxSignForm extends React.Component {
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
                   value={this.state.password}
                   error={this.props.error}/>
        <div className="row">
          <Button onClick={this.props.handleCancel.bind(this)}>Cancel</Button>
          <Button icon="tick" disabled={this.shouldBeDisabled()}>Authorize</Button>
        </div>
      </form>
    )
  }

  handleChange (e) {
    this.setState({ password: e.target.value });
  }

  shouldBeDisabled () {
    return this.state.password.length == 0 || this.props.balance == 0;
  }
}

const mapStore = ({ transaction, errors }) => {
  const { gasPrice, gasEstimate, balance } = transaction.pricing;
  const { current } = transaction.pending;

  return {
    balance,
    error: errors.txSign || null,
    currentTx: {...current, gasPrice, gasLimit: gasEstimate }
  }
}

const mapDispatch = (dispatch) => ({
  handleSubmit: function (e) {
    e.preventDefault();
    dispatch(signTransaction(this.props.currentTx, this.state.password));
  },
  handleCancel: function (e) {
    e.preventDefault();
    dispatch(cancelTransaction());
  }
});

export default connect(mapStore, mapDispatch)(TxSignForm);

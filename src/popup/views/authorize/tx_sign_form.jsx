import React               from 'react'
import { connect }         from 'react-redux'
import { signTransaction } from 'lib/store/actions'
import Button              from 'ui/button'
import PassField           from 'ui/pass_field'

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
                   value={this.state.password} />
        <Button icon="tick" disabled={this.shouldBeDisabled()}>Authorize</Button>

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

const mapStore = ({ pending, transaction, balance }) => {
  const { gasPrice, gasEstimate } = transaction;
  const params = pending[0].params[0];

  return {
    balance,
    currentTx: Object.assign({ gasPrice, gasLimit: gasEstimate }, params)
  }
}

const mapDispatch = (dispatch) => ({
  handleSubmit: function (e) {
    e.preventDefault();
    dispatch(signTransaction(this.props.currentTx, this.state.password));
  }
});

export default connect(mapStore, mapDispatch)(TxSignForm);

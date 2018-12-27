import React               from 'react'
import { connect }         from 'react-redux'
import Button              from 'ui/button'
import { signTransaction } from 'lib/store/actions'
import unit                from 'ethjs-unit'

class TxSignForm extends React.Component {
  constructor (props) {
    super(props);
    this.inputRef = React.createRef();
  }

  render () {
    return (
      <form className="tx-sign-form" onSubmit={this.props.handleSubmit.bind(this)}>
        <input ref={this.inputRef} value={this.inputRef.value} type="password"/>
        <Button icon="human">Authorize</Button>
      </form>
    )
  }
}

const mapStore = ({ pending, balance, transaction }) => ({
  currentTx: Object.assign(pending[0].params[0],
                           { gasPrice: transaction.gasPrice },
                           { gasLimit: transaction.gasEstimate })
});

const mapDispatch = (dispatch) => ({
  handleSubmit: function (e) {
    e.preventDefault();
    dispatch(signTransaction(this.props.currentTx, this.inputRef.current.value));
  }
});

export default connect(mapStore, mapDispatch)(TxSignForm);

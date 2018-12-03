import React       from 'react'
import { connect } from 'react-redux'
import PassField   from 'ui/pass_field'
import { txSign }  from 'lib/store/actions'

class TxSignForm extends React.Component {
  constructor(props) {
    super(props);
    this.inputRef = React.createRef();
  }

  render () {
    return (
      <form className="tx-sign-form" onSubmit={this.props.handleSubmit}>
        <PassField name="password"
                   label="Password"
                   ref={this.inputRef}
                   value={this.inputRef.value} />
      </form>
    )
  }
}

const mapStore = (store) => ({
  transaction: store.pending[0]
});

const mapDispatch = (dispatch) => ({
  handleSubmit: (e) => {
    dispatch(txSign(this.props.transaction, e.target.value));
  }
});

export default connect(mapStore, mapDispatch)(TxSignForm);

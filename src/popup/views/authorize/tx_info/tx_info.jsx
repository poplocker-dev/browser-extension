import React           from 'react'
import { connect }     from 'react-redux'
import { fetchTxInfo } from 'lib/store/actions'

class TxInfo extends React.Component {

  componentDidMount() {
    this.props.dispatch(fetchTxInfo());
  }

  render () { return this.props.children }
}

export default connect()(TxInfo);

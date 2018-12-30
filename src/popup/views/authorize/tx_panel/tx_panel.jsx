import React            from 'react'
import { connect }      from 'react-redux'
import { fetchTxInfo }  from 'lib/store/actions'
import TransactionValue from './transaction_value'
import TransactionFee   from './transaction_fee'
import TransactionTotal from './transaction_total'

import './tx_panel.css'

class TxPanel extends React.Component {
  componentDidMount() {
    this.props.dispatch(fetchTxInfo());
  }

  render () {
    return (
      <div className="tx-panel">
        <div className="title">
          Confirm your transaction
        </div>
        <div className="row">
          <div className="caption">
            Amount:
          </div>
          <TransactionValue/>
        </div>
        <div className="row">
          <div className="caption">
            Fees:
          </div>
          <TransactionFee/>
        </div>
        <hr/>
        <div className="row total">
          <div className="caption">
            Total
          </div>
          <TransactionTotal/>
        </div>
      </div>
    );
  }
}

export default connect()(TxPanel);

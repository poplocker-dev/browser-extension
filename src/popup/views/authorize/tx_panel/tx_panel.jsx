import React            from 'react'
import { connect }      from 'react-redux'
import { fetchTxInfo }  from 'lib/store/actions'
import SenderDomain     from './sender_domain'
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
          From: <SenderDomain/>
        </div>
        <div className="row">
          Amount: <TransactionValue/>
        </div>
        <div className="row">
          Fees: <TransactionFee/>
        </div>
        <div className="separator"/>
        <div className="row total">
          Total <TransactionTotal/>
        </div>
      </div>
    );
  }
}

export default connect()(TxPanel);

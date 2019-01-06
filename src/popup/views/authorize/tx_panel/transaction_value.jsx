import React       from 'react'
import { connect } from 'react-redux'
import unit        from 'ethjs-unit'
import Preloader   from 'ui/loader'

const TransactionValue = ({ transactionValue }) => (
  <div className="transaction-value">
    <Preloader value={ transactionValue }>
      <div className="transaction-value-amount">{ transactionValue }&nbsp;ETH</div>
    </Preloader>
  </div>
);

const mapStore = ({ transaction }) => ({
  transactionValue: unit.fromWei(transaction.value, 'ether')
});

export default connect(mapStore)(TransactionValue);

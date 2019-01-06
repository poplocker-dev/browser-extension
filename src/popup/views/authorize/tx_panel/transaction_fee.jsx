import React       from 'react'
import { connect } from 'react-redux'
import unit        from 'ethjs-unit'
import Preloader   from 'ui/loader'

const TransactionFee = ({ transactionFee }) => (
  <div className="transaction-fee">
    <Preloader value={ transactionFee }>
      <div className="transaction-fee-amount">{ transactionFee }&nbsp;ETH</div>
    </Preloader>
  </div>
);

const mapStore = ({ transaction }) => ({
    transactionFee: unit.fromWei(transaction.gasPrice * transaction.gasEstimate, 'ether')
});

export default connect(mapStore)(TransactionFee);

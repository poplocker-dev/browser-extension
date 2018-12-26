import React       from 'react'
import { connect } from 'react-redux'
import unit        from 'ethjs-unit'
import Preloader   from 'ui/loader'

const TransactionFee = ({ transactionFee }) => (
  <div className="transaction-fee">
    <Preloader value={ transactionFee }>
      <div className="transaction-fee-amount">{ transactionFee } ETH</div>
    </Preloader>
  </div>
);

const mapStore = ({ transaction }) => {
  const price    = unit.fromWei(transaction.gasPrice, 'gwei');
  const estimate = transaction.gasEstimate;

  return {
    transactionFee: unit.fromWei(price * estimate, 'ether')
  }
};

export default connect(mapStore)(TransactionFee);

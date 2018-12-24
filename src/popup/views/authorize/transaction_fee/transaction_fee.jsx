import React       from 'react'
import { connect } from 'react-redux'
import Preloader   from 'ui/loader'
import unit from 'ethjs-unit'

const TransactionFee = ({ transactionFee }) => (
  <div className="transaction-fee">
    <Preloader value={ transactionFee }>
      <div className="transaction-fee-amount">{ transactionFee } ETH</div>
    </Preloader>
  </div>
);

const mapStore = (store) => {
  const price = unit.toWei(store.transaction.gasPrice, 'gwei');
  const estimate = store.transaction.gasEstimate;

  return {
    transactionFee: unit.fromWei(price * estimate, 'ether')
  }
};

export default connect(mapStore)(TransactionFee);

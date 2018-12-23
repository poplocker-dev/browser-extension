import React       from 'react'
import { connect } from 'react-redux'
import Preloader   from 'ui/loader'
import unit from 'ethjs-unit'

const TransactionValue = ({ transactionValue }) => (
  <div className="transaction-value">
    <Preloader value={ transactionValue }>
      <div className="transaction-value-amount">{ transactionValue } ETH</div>
    </Preloader>
  </div>
);

const mapStore = ({ pending }) => {
  const pendingOne = pending[0].params[0];

  return {
    transactionValue: unit.fromWei(pendingOne.value, 'ether')
  }
};

export default connect(mapStore)(TransactionValue);

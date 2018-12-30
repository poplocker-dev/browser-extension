import React       from 'react'
import { connect } from 'react-redux'
import unit        from 'ethjs-unit'
import Preloader   from 'ui/loader'

const TransactionTotal = ({ total }) => (
  <div className="transaction-total">
    <Preloader value={ total }>
      <div className="amount">{ total } ETH</div>
    </Preloader>
  </div>
);

const mapStore = ({ transaction }) => {
  const { gasPrice, gasEstimate, value } = transaction;
  const total = (gasPrice * gasEstimate) + parseInt(value);
  return {
    total: unit.fromWei(total, 'ether')
  }
};

export default connect(mapStore)(TransactionTotal);

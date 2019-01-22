import React       from 'react'
import { connect } from 'react-redux'
import unit        from 'ethjs-unit'
import Preloader   from 'ui/loader'

const TransactionFee = ({ fee }) => (
  <div className="transaction-fee">
    <Preloader value={ fee }>
      <div className="amount transaction-fee-amount">{ fee } ETH</div>
    </Preloader>
  </div>
);

const mapStore = ({ transaction }) => {
  const { gasPrice, gasEstimate } = transaction.pricing;

  return {
    fee: unit.fromWei(gasPrice * gasEstimate, 'ether')
  }
};

export default connect(mapStore)(TransactionFee);

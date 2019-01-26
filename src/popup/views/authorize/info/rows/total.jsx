import React       from 'react'
import unit        from 'ethjs-unit'
import Preloader   from 'ui/loader'

const TransactionTotal = ({ transaction }) => (
  <div className="row total">
    <span className="row-label">Total:</span>
    <Preloader value={ transaction.pending.current }>
      <div className="amount">{ total(transaction) } ETH</div>
    </Preloader>
  </div>
);

const total = (tx) => {
  const { gasPrice, gasEstimate } = tx.pricing;
  const value = tx.pending.current.params.value || 0;
  const total = (gasPrice * gasEstimate) + parseInt(value);

  return unit.fromWei(total, 'ether');
};

export default TransactionTotal;

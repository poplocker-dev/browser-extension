import React     from 'react'
import Preloader from 'ui/loader'
import unit      from 'ethjs-unit'
import toBN      from 'number-to-bn'

const TransactionTotal = ({ transaction }) => (
  <div className="row total">
    <span className="row-label">Total:</span>
    <Preloader value={ transaction.pending.current }>
      <div className="amount">{ total(transaction) } ETH</div>
    </Preloader>
  </div>
);

const total = (tx) => {
  const value = toBN(tx.pending.current.params.value || 0);
  const total = tx.pricing.fee.add(value);

  return unit.fromWei(total, 'ether');
};

export default TransactionTotal;

import React        from 'react'
import Preloader    from 'ui/loader'
import toBN         from 'number-to-bn'
import { fixedEth } from 'lib/helpers'

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

  return fixedEth(total);
};

export default TransactionTotal;

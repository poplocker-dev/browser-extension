import React        from 'react'
import Preloader    from 'ui/loader'
import toBN         from 'number-to-bn'
import { fixedEth } from 'lib/helpers'

const TransactionTotal = ({ tx }) => (
  <div className="row total">
    <span className="row-label">Total:</span>
    <Preloader value={ tx.current }>
      <div className="amount">{ total(tx) } ETH</div>
    </Preloader>
  </div>
);

const total = (tx) => {
  const value = toBN(tx.current.params.value || 0);
  const total = tx.pricing.fee.add(value);

  return fixedEth(total);
};

export default TransactionTotal;

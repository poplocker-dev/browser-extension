import React              from 'react'
import { formatWeiToEth } from 'lib/helpers'
import Preloader          from 'ui/loader'

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

  return formatWeiToEth(total);
};

export default TransactionTotal;

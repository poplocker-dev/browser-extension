import React              from 'react'
import unit               from 'ethjs-unit'
import { formatWeiToEth } from 'lib/helpers'
import Preloader          from 'ui/loader'

const TransactionFee = ({ transaction }) => (
  <div className="row transaction-fee">
    <span className="row-label">Fees:</span>
    <Preloader value={ transaction.pending.current }>
      <div className="amount">{ fee(transaction) } ETH</div>
    </Preloader>
  </div>
);

const fee = (transaction) => {
  const { gasPrice, gasEstimate } = transaction.pricing;

  return formatWeiToEth(gasPrice * gasEstimate);
};

export default TransactionFee;

import React     from 'react'
import unit      from 'ethjs-unit'
import Preloader from 'ui/loader'

const TransactionFee = ({ transaction }) => (
  <div className="row transaction-fee">
    <span className="row-label">Fees:</span>
    <Preloader value={ transaction.pending.current }>
      <div className="amount">{ fee(transaction) } ETH</div>
    </Preloader>
  </div>
);

const fee = (transaction) => (
  unit.fromWei(transaction.pricing.fee, 'ether')
);

export default TransactionFee;

import React        from 'react'
import Preloader    from 'ui/loader'
import { fixedEth } from 'lib/helpers'

const TransactionFee = ({ transaction }) => (
  <div className="row transaction-fee">
    <span className="row-label">Fees:</span>
    <Preloader value={ transaction.pending.current }>
      <div className="amount">{ fee(transaction) } ETH</div>
    </Preloader>
  </div>
)

const fee = (transaction) => fixedEth(transaction.pricing.fee);

export default TransactionFee;

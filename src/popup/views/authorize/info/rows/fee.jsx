import React        from 'react'
import Preloader    from 'ui/loader'
import { fixedEth } from 'lib/helpers'

const TransactionFee = ({ tx }) => (
  <div className="row transaction-fee">
    <span className="row-label">Fees:</span>
    <Preloader value={ tx.current }>
      <div className="amount">{ fee(tx) } ETH</div>
    </Preloader>
  </div>
)

const fee = (tx) => fixedEth(tx.pricing.fee);

export default TransactionFee;

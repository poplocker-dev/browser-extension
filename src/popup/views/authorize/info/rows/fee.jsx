import React         from 'react'
import { Preloader } from '@poplocker/react-ui'
import { fixedEth }  from 'lib/helpers'

const TransactionFee = ({ tx }) => (
  <div className="row transaction-fee">
    <span className="row-label">Fees:</span>
    <Preloader value={ tx.pricing }>
      <div className="amount">{fee(tx)} ETH</div>
    </Preloader>
  </div>
)

const fee = (tx) => fixedEth(tx.pricing ? tx.pricing.fee : 0);

export default TransactionFee;

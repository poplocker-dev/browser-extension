import React        from 'react'
import toBN         from 'number-to-bn'
import { fixedEth } from 'lib/helpers'
import Preloader    from 'ui/loader'

const TransactionValue = ({ transaction }) => (
  <div className="row transaction-value">
    <span className="row-label">Amount:</span>
    <Preloader value={ transaction.pending.current }>
      <div className="amount">{ value(transaction) } ETH</div>
    </Preloader>
  </div>
);

const value = (tx) => (
  fixedEth(toBN(tx.pending.current.params.value || 0))
)

export default TransactionValue;

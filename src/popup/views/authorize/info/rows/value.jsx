import React        from 'react'
import toBN         from 'number-to-bn'
import { fixedEth } from 'lib/helpers'
import Preloader    from 'ui/loader'

const TransactionValue = ({ tx }) => (
  <div className="row transaction-value">
    <span className="row-label">Amount:</span>
    <Preloader value={ tx.current }>
      <div className="amount">{ value(tx) } ETH</div>
    </Preloader>
  </div>
);

const value = (tx) => (
  fixedEth(toBN(tx.current.params.value || 0))
)

export default TransactionValue;

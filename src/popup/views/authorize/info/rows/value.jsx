import React              from 'react'
import { formatWeiToEth } from 'lib/helpers'
import Preloader          from 'ui/loader'

const TransactionValue = ({ transaction }) => (
  <div className="row transaction-value">
    <span className="row-label">Amount:</span>
    <Preloader value={ transaction.pending.current }>
      <div className="amount">{ value(transaction) } ETH</div>
    </Preloader>
  </div>
);

const value = (tx) => (
  formatWeiToEth(tx.pending.current.params.value || 0)
);

export default TransactionValue;

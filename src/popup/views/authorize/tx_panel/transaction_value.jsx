import React              from 'react'
import { connect }        from 'react-redux'
import { formatWeiToEth } from 'lib/helpers'
import Preloader          from 'ui/loader'

const TransactionValue = ({ transactionValue }) => (
  <div className="transaction-value">
    <Preloader value={ transactionValue }>
      <div className="transaction-value-amount">{ transactionValue }&nbsp;ETH</div>
    </Preloader>
  </div>
);

const mapStore = ({ transaction }) => ({
  transactionValue: formatWeiToEth(transaction.value)
});

export default connect(mapStore)(TransactionValue);

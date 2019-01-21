import React              from 'react'
import { connect }        from 'react-redux'
import { formatWeiToEth } from 'lib/helpers'
import Preloader          from 'ui/loader'

const TransactionFee = ({ transactionFee }) => (
  <div className="transaction-fee">
    <Preloader value={ transactionFee }>
      <div className="transaction-fee-amount">{ transactionFee }&nbsp;ETH</div>
    </Preloader>
  </div>
);

const mapStore = ({ transaction }) => ({
    transactionFee: formatWeiToEth(transaction.gasPrice * transaction.gasEstimate)
});

export default connect(mapStore)(TransactionFee);

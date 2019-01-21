import React              from 'react'
import { connect }        from 'react-redux'
import { formatWeiToEth } from 'lib/helpers'
import Preloader          from 'ui/loader'

const TransactionTotal = ({ total }) => (
  <div className="transaction-total">
    <Preloader value={ total }>
      <div className="amount">{ total }&nbsp;ETH</div>
    </Preloader>
  </div>
);

const mapStore = ({ transaction }) => {
  const { gasPrice, gasEstimate, value } = transaction;
  const total = (gasPrice * gasEstimate) + parseInt(value);

  return {
    total: formatWeiToEth(total)
  }
};

export default connect(mapStore)(TransactionTotal);

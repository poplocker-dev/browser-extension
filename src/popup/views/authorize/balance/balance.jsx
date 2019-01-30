import React              from 'react'
import { connect }        from 'react-redux'
import { formatWeiToEth } from 'lib/helpers'
import Preloader          from 'ui/loader'

import './balance.css'

const AccountBalance = ({ balance }) => (
  <div className="account-balance">
    <Preloader value={ balance }>
      <div className="amount">{ balance } ETH</div>
    </Preloader>
  </div>
);

const mapStore = ({ transaction }) => ({
  balance: formatWeiToEth(transaction.pricing.balance)
});

export default connect(mapStore)(AccountBalance);

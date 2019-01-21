import React              from 'react'
import { connect }        from 'react-redux'
import { formatWeiToEth } from 'lib/helpers'
import Preloader          from 'ui/loader'

import './account_balance.css'

const AccountBalance = ({ balance }) => (
  <div className="account-balance">
    <Preloader value={ balance }>
      <div className="amount">{ balance }&nbsp;ETH</div>
    </Preloader>
  </div>
);

const mapStore = (store) => ({
  balance: formatWeiToEth(store.balance)
});

export default connect(mapStore)(AccountBalance);

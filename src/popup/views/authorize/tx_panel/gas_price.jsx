import React       from 'react'
import { connect } from 'react-redux'
import unit        from 'ethjs-unit'
import Preloader   from 'ui/loader'

const GasPrice = ({ gasPrice }) => (
  <div className="gas-price">
    <Preloader value={ gasPrice }>
      <div className="gas-price-amount">{ gasPrice } Gwei</div>
    </Preloader>
  </div>
);

const mapStore = ({ transaction }) => ({
  gasPrice: unit.fromWei(transaction.gasPrice, 'gwei')
});

export default connect(mapStore)(GasPrice);

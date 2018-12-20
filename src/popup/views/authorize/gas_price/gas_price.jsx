import React       from 'react'
import { connect } from 'react-redux'
import Preloader   from 'ui/loader'

const GasPrice = ({ gasPrice }) => (
  <div className="gas-price">
    <Preloader value={ gasPrice }>
      <div className="gas-price-amount">{ gasPrice } Gwei</div>
    </Preloader>
  </div>
);

const mapStore = (store) => {
  return {
    gasPrice: store.transaction.gasPrice
  }
}

export default connect(mapStore)(GasPrice);

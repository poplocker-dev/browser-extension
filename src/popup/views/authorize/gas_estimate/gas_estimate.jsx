import React       from 'react'
import { connect } from 'react-redux'
import Preloader   from 'ui/loader'

const GasEstimate = ({ gasEstimate }) => (
  <div className="gas-estimate">
    <Preloader value={ gasEstimate }>
      <div className="gas-estimate-amount">{ gasEstimate } Gas</div>
    </Preloader>
  </div>
);

const mapStore = (store) => {
  return {
    gasEstimate: store.transaction.gasEstimate
  }
}

export default connect(mapStore)(GasEstimate);

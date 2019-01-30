import React              from 'react'
import { updatePricing }  from 'lib/store/actions'

class GasPrice extends React.Component {
  constructor (props) {
    super(props);
    this.state = { initialGasPrice: null }
  }

  componentDidUpdate() {
    if (!this.state.initialGasPrice) {
      this.setState({ initialGasPrice: this.props.transaction.pricing.gasPrice });
    }
  }

  render () {
    if (this.props.showAdvanced) {
      return ( 
        <input className="gas-price-slider"
          type="range"
          min="1"
          max={ 10 * parseInt(this.state.initialGasPrice) }
          step="1"
          value={ parseInt(this.props.transaction.pricing.gasPrice) }
          onChange={ this.handleChange.bind(this) }
        />
      );
    } else {
      return null;
    }
  }

  handleChange (e) {
    this.props.transaction.pricing.gasPrice = '0x' + parseInt(e.target.value).toString(16);
    this.props.dispatch(updatePricing(this.props.transaction.pricing));
  }
}

export default GasPrice;

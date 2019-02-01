import React             from 'react'
import { connect }       from 'react-redux'
import { updatePricing } from 'lib/store/actions'

class GasPriceSlider extends React.Component {
  constructor (props) {
    super(props);
    this.state    = { value: 1, base: null }
    this.pricing  = props.transaction.pricing;
    this.dispatch = props.dispatch;
  }

  componentDidMount () {
    this.setState({ base: this.pricing });
  }

  render () {
    return (
      <input className="gas-price-slider"
             type="range"
             min="1"
             max="100"
             step="1"
             value={this.state.value}
             onChange={this.handleChange.bind(this)}
      />
    );
  }

  handleChange (e) {
    if (this.state.base) {
      this.setState({ value: e.target.value });

      const newPrice = this.state.base.gasPrice
                           .muln(parseInt(e.target.value))
                           .divn(10);

      this.dispatch(updatePricing({...this.pricing, gasPrice: newPrice }));
    }
  }
}

export default connect()(GasPriceSlider);

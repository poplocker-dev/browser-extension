import React             from 'react'
import Range             from './range'
import { connect }       from 'react-redux'
import { updatePricing } from 'lib/store/actions'

class Sliders extends React.Component {
  constructor (props) {
    super(props);

    this.base     = props.pricing;
    this.dispatch = props.dispatch;

    this.state = {
      initialGasPrice: this.base.gasPrice,
      currentGasPrice: this.base.gasPrice
    }
  }

  render () {
    return (
      <div className="row sliders">

        <Range label="transfer"
               from="slower"
               to="quicker"
               min="1"
               max={this.state.initialGasPrice*10}
               value={this.state.currentGasPrice}
               onChange={this.handleChange.bind(this)}
        />
      </div>
    );
  }

  handleChange (e) {
    const { value } = e.target;

    if (this.base) {
      this.setState({

        currentGasPrice: value
      }, () => {
        this.dispatch(updatePricing({...this.base, gasPrice: this.state.currentGasPrice}));
      });
    }
  }
}

export default connect()(Sliders);

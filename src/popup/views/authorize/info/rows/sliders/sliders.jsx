import React             from 'react'
import Range             from './range'
import { connect }       from 'react-redux'
import { updatePricing } from 'lib/store/actions'

class Sliders extends React.Component {
  constructor (props) {
    super(props);
  }

  componentDidUpdate() {

    if (!this.base) {
      this.base     = this.props.tx.pricing;
      this.dispatch = this.props.dispatch;

      const currentGasPrice = this.base.gasPrice*2;
      this.setState({ minimumGasPrice: this.base.gasPrice, currentGasPrice });
      this.dispatch(updatePricing([this.base.balance, currentGasPrice, this.base.gasEstimate, this.base.overhead]));
    }
  }

  render () {
    if (this.props.advancedMode) {
      return (
        <div className="row sliders">

          <Range label="transfer"
                 from="slower"
                 to="quicker"
                 min={this.state.minimumGasPrice}
                 max={this.state.minimumGasPrice*10}
                 value={this.state.currentGasPrice}
                 onChange={this.handleChange.bind(this)}
          />
        </div>
      );
    } else {
      return null;
    }
  }

  handleChange (e) {
    const { value } = e.target;

    if (this.base) {
      this.setState({

        currentGasPrice: value
      }, () => {
        this.dispatch(updatePricing([this.base.balance, this.state.currentGasPrice, this.base.gasEstimate, this.base.overhead]));
      });
    }
  }
}

export default connect(({ advancedMode }) => ({ advancedMode }))(Sliders);

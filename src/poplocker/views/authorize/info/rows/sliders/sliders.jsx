import React                        from 'react'
import Range                        from './range'
import { updatePricing, revalueTx } from 'lib/store/actions'

class Sliders extends React.Component {
  componentDidUpdate() {
    if (!this.base && this.props.tx.pricing && this.props.tx.balance) {
      this.base     = this.props.tx.pricing;
      this.balance  = this.props.tx.balance;
      this.dispatch = this.props.dispatch;

      this.setState({ minimumGasPrice: this.base.gasPrice }, () => {
        this.updateGasPrice(this.base.gasPrice*2);
      });
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
                 value={this.state.gasPrice}
                 onChange={this.handleChange.bind(this)}
          />
        </div>
      );
    } else {
      return null;
    }
  }

  handleChange (e) {
    if (this.base) {
      this.updateGasPrice(e.target.value);
    }
  }

  updateGasPrice (gasPrice) {
    this.setState({ gasPrice }, () => {
      this.dispatch(updatePricing([this.state.gasPrice, this.base.gasEstimate]));
      if (this.props.tx.current.params.sendAll)
        this.dispatch(revalueTx(this.state.gasPrice*this.base.gasEstimate, this.balance));
    });
  }
}

export default Sliders;

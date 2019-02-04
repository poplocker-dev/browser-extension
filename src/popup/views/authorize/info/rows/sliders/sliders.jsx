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
      gasPriceMul:    1,
      gasEstimateMul: 1,
      gasPrice:    this.base.gasPrice,
      gasEstimate: this.base.gasEstimate
    }
  }

  // TODO: Fix gas estimate range to be 1x -- 2x
  render () {
    return (
      <div className="row sliders">

        <Range label="transfer"
               from="slower"
               to="quicker"
               value={this.state.gasPriceMul}
               onChange={e => this.handleChange(e, 'gasPrice')}
        />
        <Range label="size"
               from="smaller"
               to="quicker"
               value={this.state.gasEstimateMul}
               onChange={e => this.handleChange(e, 'gasEstimate')}
        />
      </div>
    );
  }

  handleChange (e, name) {
    const { value } = e.target;

    if (this.base) {
      this.setState({

        [`${name}Mul`]: value,
        [name]: this.base[name].muln(parseInt(value)).divn(10)

      }, () => {
        const { gasPrice, gasEstimate } = this.state;
        this.dispatch(updatePricing({...this.base, gasPrice, gasEstimate}));
      });
    }
  }
}

export default connect()(Sliders);

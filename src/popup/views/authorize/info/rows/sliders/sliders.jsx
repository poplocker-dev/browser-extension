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
      mult: Math.ceil(this.base.gasPrice.toNumber()/1000000000),
      gasPrice: this.base.gasPrice
    }
  }

  // TODO: Fix gas estimate range to be 1x -- 2x
  render () {
    return (
      <div className="row sliders">

        <Range label="transfer"
               from="slower"
               to="quicker"
               value={this.state.mult}
               onChange={this.handleChange.bind(this)}
        />
      </div>
    );
  }

  handleChange (e) {
    const { value } = e.target;

    if (this.base) {
      this.setState({

        mult: value,
        gasPrice: this.base.gasPrice.muln(parseInt(value)).divn(10)

      }, () => {
        this.dispatch(updatePricing({...this.base, gasPrice: this.state.gasPrice}));
      });
    }
  }
}

export default connect()(Sliders);

import React        from 'react'
import Preloader    from 'ui/loader'
import toBN         from 'number-to-bn'
import { fixedEth } from 'lib/helpers'
import { noFunds }  from 'lib/store/actions'

class TransactionTotal extends React.Component {
  componentDidMount () {
    if (this.noFunds(this.props.tx))
      this.props.dispatch(noFunds());
  }

  render () {
    return (
      <div className="row total">
        <span className="row-label">Total:</span>
        <Preloader value={ this.props.tx.pricing }>
          <div className="amount">{ this.total(this.props.tx) } ETH</div>
        </Preloader>
      </div>
    )
  }

  total (tx) {
    const value = toBN(tx.current.params.value || 0);
    const total = tx.pricing ? tx.pricing.fee.add(value) : 0;

    return fixedEth(total);
  }

  noFunds (tx) {
    if (tx.pricing) {
      const { balance, fee } = tx.pricing;
      const value = toBN(tx.current.params.value || 0);

      return balance.lt(value.add(fee));
    }
    else return false;
  }
}

export default TransactionTotal;

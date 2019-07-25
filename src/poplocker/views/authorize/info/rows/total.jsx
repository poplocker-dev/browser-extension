import React         from 'react'
import { Preloader } from '@poplocker/react-ui'
import toBN          from 'number-to-bn'
import { connect }   from 'react-redux'
import { fixedEth }  from 'lib/helpers'
import { noFunds }   from 'lib/store/actions'

class TransactionTotal extends React.Component {
  componentDidUpdate () {
    if (this.noFunds(this.props.tx))
      this.props.dispatch(noFunds('Insufficient funds'));
    else
      this.props.dispatch(noFunds(false));
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
    if (tx.balance && tx.pricing) {
      const value = toBN(tx.current.params.value || 0);
      return tx.balance.lt(value.add(tx.pricing.fee));
    }
    else return false;
  }
}

export default connect()(TransactionTotal);

import React      from 'react'
import { Button } from '@poplocker/react-ui'
import { getSmartLockerState } from 'lib/rpc/locker'

class Locker extends React.Component {
  constructor (props) {
    super(props);
    this.state = { status: null };
  }

  componentDidMount () {
    getSmartLockerState().then(({ result }) => this.setState({
        status: result.status,
        name: result.name,
        onlyKey: result.onlyKey
      }));
  }

  label () {
    if (!this.state.status) return '...'

    return this.state.status == 'smart' ? this.state.name : this.state.status;
  }

  render () {
    return (
      <div className="locker-button">
      <Button>{ this.label() }</Button>
      </div>
    )
  }
}

export default Locker;

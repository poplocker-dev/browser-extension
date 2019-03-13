import React      from 'react'
import { Button } from '@poplocker/react-ui'
import { getSmartLockerState } from 'lib/rpc/locker'

class Locker extends React.Component {
  constructor (props) {
    super(props);
    this.state = { status: 'Simple Locker' };
  }

  componentDidMount () {
    getSmartLockerState()
      .then(status => this.setState({ status }));
  }

  render () {
    return (
      <div className="locker-button">
        <Button>{ this.state.status }</Button>
      </div>
    )
  }
}

export default Locker;

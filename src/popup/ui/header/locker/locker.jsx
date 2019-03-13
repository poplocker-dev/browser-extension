import React      from 'react'
import { Button } from '@poplocker/react-ui'
import { locker } from 'lib/rpc/locker'

class Locker extends React.Component {

  componentDidMount () {
    this.setState({ status: locker.getSmartLocerState() });
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

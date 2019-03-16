import React                   from 'react'
import { LockerButton }        from '@poplocker/react-ui'
import { getSmartLockerState } from 'lib/rpc/locker'

class Locker extends React.Component {
  componentDidMount () {
    getSmartLockerState().then(({ result }) => {
      this.setState({ ...result });
    });
  }

  render () {
    return (
      <LockerButton {...this.state}/>
    )
  }
}

export default Locker;

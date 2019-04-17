import React                   from 'react'
import { LockerButton }        from '@poplocker/react-ui'
import { getSmartLockerState } from 'lib/rpc/locker'
import { lockerRedirect }      from 'lib/helpers'

class Locker extends React.Component {
  componentDidMount () {
    getSmartLockerState().then(({ result }) => {
      this.setState({ ...result });
    });
  }

  render () {
    return (
      <div className="locker-wrapper">
        <LockerButton locker={this.state}
                      onClick={this.handleClick.bind(this)}/>
      </div>
    )
  }

  handleClick () {
    lockerRedirect();
  }
}

export default Locker;

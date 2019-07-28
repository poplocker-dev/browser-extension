import React              from 'react'
import { connect }        from 'react-redux'
import { LockerButton }   from '@poplocker/react-ui'
import { lockerRedirect } from 'lib/helpers'

import { getSmartLockerState } from 'lib/rpc/locker'
import { updateSmartLocker }   from 'lib/store/actions'

class Locker extends React.Component {
  async componentDidMount () {
    const smartLockerState = await getSmartLockerState();
    this.props.dispatch(updateSmartLocker(smartLockerState.result));
  }

  render () {
    return (
      <div className="locker-wrapper">
        <LockerButton locker={this.props.locker}
                      onClick={this.handleClick.bind(this)}/>
      </div>
    )
  }

  handleClick () {
    lockerRedirect();
  }
}

export default connect(({ locker }) => ({ locker }))(Locker);

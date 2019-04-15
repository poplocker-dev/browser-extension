import React                   from 'react'
import { LockerButton }        from '@poplocker/react-ui'
import { getSmartLockerState } from 'lib/rpc/locker'
import { lockerRedirect }      from 'lib/helpers'

class Locker extends React.Component {
  constructor (props) {
    super(props);
    this.state = { status: null };
  }

  componentDidMount () {
    getSmartLockerState().then(({ result }) => {
      this.setState({ ...result });
    });
  }

  render () {
    return (
      <LockerButton locker={this.state}
                    onClick={this.handleClick.bind(this)}/>
    )
  }

  handleClick () {
    lockerRedirect();
  }
}

export default Locker;

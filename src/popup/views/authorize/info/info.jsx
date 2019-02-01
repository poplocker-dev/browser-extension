import React   from 'react'
import Fee     from './rows/fee'
import Value   from './rows/value'
import Total   from './rows/total'
import Domain  from './rows/domain'
import Sliders from './rows/sliders'

import './info.css'

const TransactionInfo = (props) => {
  return  (
    <div className="transaction-info">
      <div className="title">
        Confirm your transaction
      </div>

      <Domain   {...props}/>
      <Value    {...props}/>
      <Fee      {...props}/>
      { sliders(props) }
      <div className="separator"/>
      <Total    {...props}/>

    </div>
  );
}

const sliders = ({ advanced, transaction }) => {
  if (advanced)
    return <Sliders {...transaction}/>
  else
    return null;
}

export default TransactionInfo;

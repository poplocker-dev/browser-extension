import React    from 'react'
import Domain   from './rows/domain'
import Value    from './rows/value'
import Fee      from './rows/fee'
import GasPrice from './rows/gas_price'
import Total    from './rows/total'

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
    return <GasPrice transaction={transaction}/>
  else
    return null;
}

export default TransactionInfo;

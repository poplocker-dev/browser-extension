import React       from 'react'
import { connect } from 'react-redux'
import Fee         from './rows/fee'
import Value       from './rows/value'
import Total       from './rows/total'
import Domain      from './rows/domain'
import Sliders     from './rows/sliders'

import './info.css'

const TransactionInfo = (props) => {
  return  (
    <div className="transaction-info">
      <div className="title">
        Confirm your transaction
      </div>

      <Domain {...props}/>
      <Value tx={props.tx}/>
      <Fee tx={props.tx}/>
      <Sliders {...props}/>
      <div className="separator"/>
      <Total tx={props.tx}/>

    </div>
  );
}

export default connect(({ advancedMode, tx }) => ({ advancedMode, tx }))(TransactionInfo);

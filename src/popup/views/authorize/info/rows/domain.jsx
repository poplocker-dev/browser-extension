import React         from 'react'
import { Preloader } from '@poplocker/react-ui'
import { getDomain } from 'lib/helpers'

const Domain = ({ tx, advancedMode }) => (
  <div className="row domain">
    <span className="row-label">{advancedMode? 'To:' : 'From:'}</span>
    <Preloader value={tx.current}>
      <div className="amount ellipsis">
        { advancedMode? recipient(tx) : domain(tx) }
      </div>
    </Preloader>
  </div>
);

const recipient = (tx) => (
  <span className="small-font">
    { tx.current.params.to || 'N/A' }
  </span>
)

const domain = (tx) => {
  return getDomain(tx.current.origin) || 'unknown';
}

export default Domain;

import React         from 'react'
import { Preloader } from '@poplocker/react-ui'
import parseDomain   from 'parse-domain'

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


const domain = (transaction) => {
  const origin = transaction.current.origin;
  const parts  = parseDomain(origin, { customTlds: /localhost/ });
  const parsed = Object.values(parts)
                       .filter(i => i != "")
                       .reverse()
                       .join('.');

  return parsed || 'unknown';
}

export default Domain;

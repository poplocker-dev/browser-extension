import React         from 'react'
import { Preloader } from '@poplocker/react-ui'
import parseDomain   from 'parse-domain'

const Domain = ({ tx, advancedMode }) => (
  <div className="row domain">
    <span className="row-label">{tx.current.toLocker || advancedMode? 'To:' : 'From:'}</span>
    <Preloader value={tx.current}>
      <div className="amount ellipsis">
        { advancedMode? recipient(tx) : tx.current.toLocker || domain(tx) }
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
  const origin = tx.current.origin;
  const parts  = parseDomain(origin, { customTlds: /localhost/ });
  const parsed = Object.values(parts)
                       .filter(i => i != "")
                       .reverse()
                       .join('.');

  return parsed || 'unknown';
}

export default Domain;

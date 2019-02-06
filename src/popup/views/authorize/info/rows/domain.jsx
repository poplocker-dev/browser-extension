import React       from 'react'
import Preloader   from 'ui/loader'
import parseDomain from 'parse-domain'

const Domain = ({ transaction, advanced }) => (
  <div className="row domain">
    <span className="row-label">{advanced? 'From:' : 'To:'}</span>

    <Preloader value={transaction.pending.current}>

      <div className="amount ellipsis" alt={`from ${domain(transaction)}`}>
        { advanced? recipient(transaction) : domain(transaction) }
      </div>

    </Preloader>
  </div>
);

const recipient = (tx) => (
  <span className="recipient">
    { tx.pending.current.params.to || 'N/A' }
  </span>
)


const domain = (transaction) => {
  const origin = transaction.pending.current.origin;
  const parts  = parseDomain(origin, { customTlds: /localhost/ });
  const parsed = Object.values(parts)
                       .filter(i => i != "")
                       .reverse()
                       .join('.');

  return parsed || 'unknown';
}

export default Domain;

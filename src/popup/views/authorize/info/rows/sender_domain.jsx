import React       from 'react'
import Preloader   from 'ui/loader'
import parseDomain from 'parse-domain'

const SenderDomain = ({ transaction }) => (
  <div className="row sender-domain">
    <span className="row-label">From:</span>
    <Preloader value={ transaction.pending.current }>
      <div className="amount ellipsis">{ domain(transaction) }</div>
    </Preloader>
  </div>
);

const domain = (transaction) => {
  const origin = transaction.pending.current.origin;
  const { subdomain, domain, tld } = parseDomain(origin, { customTlds: /localhost/ });
  const [parsed] = `${subdomain}.${domain}.${tld}`.split('.').filter(i => i != "");

  return parsed || 'unknown';
}

export default SenderDomain;

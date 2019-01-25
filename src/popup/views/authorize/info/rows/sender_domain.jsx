import React       from 'react'
import Preloader   from 'ui/loader'
import parseDomain from 'parse-domain'

const SenderDomain = ({ transaction }) => (
  <div className="row sender-domain">
    <span className="row-label">From:</span>
    <Preloader value={ transaction.pending.current }>
      <div className="amount elipsis">{ domain(transaction) }</div>
    </Preloader>
  </div>
);

const domain = (transaction) => {
  const origin = transaction.pending.current.origin;
  let domain = 'unknown';

  const parsedDomain = parseDomain(origin, { customTlds: /localhost/ })
;
  if (parsedDomain) {

    domain = '';

    if (parsedDomain.subdomain) domain += parsedDomain.subdomain + '.';

    if (parsedDomain.domain) domain += parsedDomain.domain + '.';

    domain += parsedDomain.tld;

  }
  return domain;
}

export default SenderDomain;

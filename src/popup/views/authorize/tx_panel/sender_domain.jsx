import React       from 'react'
import { connect } from 'react-redux'
import Preloader   from 'ui/loader'
import parseDomain from 'parse-domain'

const SenderDomain = ({ senderDomain }) => (
  <div className="sender-domain">
    <Preloader value={ senderDomain }>
      <div className="amount sender-domain-amount">{ senderDomain }</div>
    </Preloader>
  </div>
);

const mapStore = ({ transaction }) => {
  const origin = transaction.pending.current.origin;
  let domain = 'unknown';
  const parsedDomain = parseDomain(origin, { customTlds: /localhost/ })
  if (parsedDomain) {
    domain = '';
    if (parsedDomain.subdomain) domain += parsedDomain.subdomain + '.';
    if (parsedDomain.domain) domain += parsedDomain.domain + '.';
    domain += parsedDomain.tld;
  }

  return {
    senderDomain: domain
  }
};

export default connect(mapStore)(SenderDomain);

import React       from 'react'
import { connect } from 'react-redux'
import Preloader   from 'ui/loader'
import parseDomain from 'parse-domain'

const RecipientDomain = ({ recipientDomain }) => (
  <div className="recipient-domain">
    <Preloader value={ recipientDomain }>
      <div className="recipient-domain-amount">{ recipientDomain }</div>
    </Preloader>
  </div>
);

const mapStore = ({ transaction }) => {
  let domain = 'unknown';
  const parsedDomain = parseDomain(transaction.url, { customTlds: /localhost/ })
  if (parsedDomain) {
    domain = '';
    if (parsedDomain.subdomain) domain += parsedDomain.subdomain + '.';
    if (parsedDomain.domain) domain += parsedDomain.domain + '.';
    domain += parsedDomain.tld;
  }

  return {
    recipientDomain: domain
  }
};

export default connect(mapStore)(RecipientDomain);

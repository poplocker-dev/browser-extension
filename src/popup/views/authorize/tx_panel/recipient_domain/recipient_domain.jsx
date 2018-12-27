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
  const parsedDomain = parseDomain(transaction.url);
  let domain = '';
  if (parsedDomain) {
    if (parsedDomain.subdomain) domain += parsedDomain.subdomain + '.';
    if (parsedDomain.domain) domain += parsedDomain.domain + '.';
    domain += parsedDomain.tld;
  } else {
    domain = 'unknown';
  }

  return {
    recipientDomain: domain
  }
};

export default connect(mapStore)(RecipientDomain);

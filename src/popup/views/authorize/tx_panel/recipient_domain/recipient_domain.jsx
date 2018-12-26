import React       from 'react'
import { connect } from 'react-redux'
import Preloader   from 'ui/loader'

const RecipientDomain = ({ recipientDomain }) => (
  <div className="recipient-domain">
    <Preloader value={ recipientDomain }>
      <div className="recipient-domain-amount">{ recipientDomain }</div>
    </Preloader>
  </div>
);

const mapStore = ({ pending }) => {
  const url = pending[0].url;

  return {
    recipientDomain: url // TODO: strip out just the domain, not full URL
  }
};

export default connect(mapStore)(RecipientDomain);

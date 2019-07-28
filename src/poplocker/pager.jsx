import React        from 'react'
import { Bouncing } from '@poplocker/react-ui'
import { connect }  from 'react-redux'

function view (v) {
  return React.lazy(() => import(`./views/${v}/${v}`));
}

const Pager = ({ page }) => (
  <React.Suspense fallback={<Bouncing/>}>
    { React.createElement(view(page)) }
  </React.Suspense>
);

const mapStore = ({ page }) => ({ page });

export default connect(mapStore)(Pager)

import React        from 'react'
import { Bouncing } from '@poplocker/react-ui'
import { connect }  from 'react-redux'

const Pager = ({ page }) => (
  <React.Suspense fallback={<Bouncing/>}>
    { React.createElement(page) }
  </React.Suspense>
);

const mapStore = ({ page }) => ({ page });

export default connect(mapStore)(Pager)

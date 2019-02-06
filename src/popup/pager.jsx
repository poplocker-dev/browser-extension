import React from 'react'
import { connect } from 'react-redux'

const Pager = ({ page }) => (
  <React.Suspense fallback={<div>Loading...</div>}>
    { React.createElement(page) }
  </React.Suspense>
);

const mapStore = ({ page }) => ({ page });

export default connect(mapStore)(Pager)

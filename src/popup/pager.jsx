import React from 'react'
import { connect } from 'react-redux'

const Pager = (props) => {
  const el = props.children.find(i => i.type.name == props.page);
  return React.createElement(el.type);
}

const mapStore = ({ page }) => ({ page });

export default connect(mapStore)(Pager)

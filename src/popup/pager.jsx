import React from 'react'
import { connect } from 'react-redux'

const Pager = (props) => {
  const el = props.children.find(i => {
    const name = i.type.displayName || i.type.name;
    return name.indexOf(props.page) != -1;
  });

  return React.createElement(el.type);
}

const mapStore = ({ page }) => ({ page });

export default connect(mapStore)(Pager)

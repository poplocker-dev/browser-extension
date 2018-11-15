import React from 'react'
import AccountForm from './account_form'
import Header from '../header'

const NewAccountView = () => (
  <div className="new-acount-view view">
    <Header caption="Create new account on this device" />
    <AccountForm/>
  </div>
)

export default NewAccountView

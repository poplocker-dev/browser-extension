import React       from 'react'
import Header      from 'ui/header'
import AccountForm from './account_form'

const NewAccountView = () => (
  <div className="new-acount-view view">
    <Header caption="Create new account on this device" />
    <AccountForm/>
  </div>
)

export default NewAccountView

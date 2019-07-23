import React      from 'react'
import Header     from 'ui/header'
import { Button } from '@poplocker/react-ui'

import './failure.css'

const FailureView = () => (
  <div className="failure-view view">
    <Header/>
    <h2>Account generation failed</h2>
    <Button icon="close" onClick={window.close} autoFocus={true}>Close</Button>
  </div>
)

export default FailureView

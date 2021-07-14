import React from 'react'
import ResetIcon from './svgs/ResetIcon'

export default function ResetButton(props) {
  return (
    <button className="button__dark-mode" type="button" onClick={props.handleReset}>
      <ResetIcon />
      <span className="screen-reader">Reset evidence</span>
    </button>
  )
}
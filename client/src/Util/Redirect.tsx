import React from 'react'
import { Redirect } from 'react-router-dom'

type RProps = {
  url?: any
}

// Have to use a class because function doesn't work with props :(
class RedirectUrl extends React.Component<RProps> {
  render () {
    return (
      <Redirect
        to={{
          pathname: this.props.url 
        }}
      />
    )
  }
}

export default RedirectUrl

import React, { Component } from 'react'
import 'semantic-ui-css/semantic.min.css'
import './style.css'
import Auth from './auth/auth'
import WorkSpace from './workSpace'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loggedIn: false,
    }
  }

  setLoginStatus = (value) => {
    this.setState({ loggedIn: value })
  }

  render() {
    if (this.state.loggedIn === true || window.localStorage.getItem('jwtToken')) {
      return (
        <WorkSpace
          className="full-height"
          user={this.state.user}
          setLoginStatus={this.setLoginStatus}
        />
      )
    }
    return (
      <Auth
        setLoginStatus={this.setLoginStatus}
      />
    )
  }
}

export default App

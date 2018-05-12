import React, { Component } from 'react'
import 'semantic-ui-css/semantic.min.css'
import './style.css'
import LoginForm from './auth/auth'
import WorkSpace from './workSpace'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loggedIn: false,
    }
    this.setLoginState = this.setLoginState.bind(this)
  }

  setLoginState(value) {
    this.setState({ loggedIn: value })
  }

  render() {
    if (this.state.loggedIn === true || window.localStorage.getItem('jwtToken')) {
      return (
        <WorkSpace
          className="full-height"
          user={this.state.user}
          loggedIn={this.setLoginState}
        />
      )
    }
    return (
      <LoginForm
        loggedIn={this.setLoginState}
      />
    )
  }
}

export default App

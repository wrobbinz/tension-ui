import React, { Component } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import api from './api'
import './style.css'
import SideNav from './sideNav'
import NoteApp from './note/noteApp'
// import BoardApp from './board/boardApp'


class WorkSpace extends Component {
  constructor(props) {
    super(props)
    this.state = {
      focus: 'notes',
      user: {},
    }
  }

  async componentWillMount() {
    const user = await axios.get(api.users, api.config())
    this.setState({
      user: user.data,
    })
  }

  setFocus = (focus) => {
    this.setState({ focus })
  }

  render() {
    let appView
    if (this.state.focus === 'notes') {
      appView = <NoteApp user={this.state.user} />
    }
    // if (this.state.focus === 'board') {
    //   appView = <BoardApp user={this.state.user} />
    // }
    return (
      <div className="flex-wrapper">
        <div className="flex-shrink">
          <SideNav
            focus={this.state.focus}
            setFocus={this.setFocus}
            className="full-height"
            loggedIn={this.props.loggedIn}
          />
        </div>
        { appView }
      </div>
    )
  }
}

WorkSpace.propTypes = {
  loggedIn: PropTypes.func,
}

WorkSpace.defaultProps = {
  loggedIn: null,
}

export default WorkSpace

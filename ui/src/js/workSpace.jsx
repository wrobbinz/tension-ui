import React, { Component } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import api from './api'
import '../css/style.css'
import SideNav from './sideNav'
import NoteApp from './note/noteApp'


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
    return (
      <div className="full-height">
        <SideNav
          focus={this.state.focus}
          setFocus={this.setFocus}
          className="full-height"
          loggedIn={this.props.loggedIn}
        />
        {
          this.state.focus === 'notes' ?
            <NoteApp user={this.state.user} /> : null
        }
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

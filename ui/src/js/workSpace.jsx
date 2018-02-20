import React, { Component } from 'react'
import '../css/style.css'
import SideNav from './sideNav'
import NoteApp from './note/noteApp'


class WorkSpace extends Component {
  constructor(props) {
    super(props)
    this.state = {
      focus: 'notes',
    }
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
        />
        {
          this.state.focus === 'notes' ?
            <NoteApp /> : null
        }
      </div>
    )
  }
}

export default WorkSpace

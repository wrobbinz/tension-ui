import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Menu, Icon, Popup } from 'semantic-ui-react'


const DELAY = 500

const menuItems = [
  {
    name: 'board',
    icon: 'signal',
    tooltip: 'Board',
    flipped: 'vertically',
  },
  {
    name: 'notes',
    icon: 'sticky note',
    tooltip: 'Notes',
  },
  {
    name: 'code',
    icon: 'code',
    tooltip: 'Code',
  },
  {
    name: 'tasks',
    icon: 'tasks',
    tooltip: 'Tasks',
  },
  {
    name: 'sketches',
    icon: 'paint brush',
    tooltip: 'Sketches',
  },
  {
    name: 'files',
    icon: 'save',
    tooltip: 'Files',
  },
]

class SideNav extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }

  handleClick(focus) {
    this.props.setFocus(focus)
  }

  logOut = () => {
    window.localStorage.removeItem('jwtToken')
  }

  render() {
    return (
      <Menu
        className="full-height sidenav no-border-radius"
        floated
        vertical
        inverted
        icon
      >
        {menuItems.map(item => (
          <Popup
            key={item.name}
            mouseEnterDelay={DELAY}
            content={item.tooltip}
            position="right center"
            size="mini"
            inverted
            trigger={
              <Menu.Item
                className="no-border-radius"
                onClick={() => { this.handleClick(item.name) }}
                active={this.props.focus === item.name}
              >
                <Icon link size="large" name={item.icon} flipped={item.flipped} />
              </Menu.Item>
            }
          />
        ))}
        <Menu.Item
          className="no-border-radius"
          onClick={() => { this.logOut() }}
        >
          <Icon link size="large" name="log out" />
        </Menu.Item>
      </Menu>
    )
  }
}

SideNav.propTypes = {
  focus: PropTypes.string,
  setFocus: PropTypes.func,
}

SideNav.defaultProps = {
  focus: false,
  setFocus: false,
}

export default SideNav

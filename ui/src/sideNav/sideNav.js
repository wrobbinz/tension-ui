import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Menu, Icon, Popup, List } from 'semantic-ui-react'
import Settings from '../settings'
import './sideNav.css'


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
    name: 'drive',
    icon: 'disk',
    tooltip: 'Drive',
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
    this.props.loggedIn(false)
  }

  render() {
    return (
      <Menu
        className="full-height sidenav no-border-radius no-margin"
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
        <Popup
          size="large"
          className="setting-popup"
          inverted
          trigger={
            <Menu.Item
              className="setting-nav no-border-radius"
            >
              <Icon link size="large" name="setting" />
            </Menu.Item>
          }
          on="click"
          position="right center"
          content={
            <List>
              <Settings />
              <List.Item
                icon="announcement"
                content="Feedback"
                className="pointer"
              />
              <List.Item
                icon="log out"
                onClick={() => { this.logOut() }}
                content="Sign out"
                className="pointer"
              />
            </List>
          }
        />
      </Menu>
    )
  }
}

SideNav.propTypes = {
  loggedIn: PropTypes.func,
  focus: PropTypes.string,
  setFocus: PropTypes.func,
}

SideNav.defaultProps = {
  loggedIn: null,
  focus: false,
  setFocus: false,
}

export default SideNav

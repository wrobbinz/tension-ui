import React, { Component } from 'react'
import { Menu, Icon, Popup } from 'semantic-ui-react'
import '../css/style.css'
import WorkMenu from './workMenu'


const DELAY = 500

const menuItems = [
  {
    name: 'notes',
    icon: 'sticky note',
    tooltip: 'Notes',
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
    name: 'fies',
    icon: 'save',
    tooltip: 'Files',
  },
]

class SideNav extends Component {
  constructor(props) {
    super(props)
    this.state = {
      focus: 'notes',
    }
  }

  handleClick(focus) {
    this.setState({ focus })
  }

  render() {
    return (
      <div className="full-height">
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
                  active={this.state.focus === item.name}
                >
                  <Icon link size="large" name={item.icon} />
                </Menu.Item>
              }
            />
          ))}
        </Menu>
        <WorkMenu
          className="full-height"
          focus={this.state.focus}
          floated
        />
      </div>
    )
  }
}

export default SideNav

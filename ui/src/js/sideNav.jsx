import React, { Component } from 'react'
import { Sidebar, Segment, Menu, Icon, Popup } from 'semantic-ui-react'
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
        <Menu floated icon vertical inverted className="full-height sidenav no-border-radius">
          {menuItems.map(item => (
            <Popup
              trigger={
                <Menu.Item
                  className="no-border-radius"
                  onClick={() => { this.handleClick(item.name) }}
                  active={this.state.focus === item.name}
                >
                  <Icon link size="large" name={item.icon} />
                </Menu.Item>
              }
              key={item.name}
              mouseEnterDelay={DELAY}
              content={item.tooltip}
              position="right center"
              size="mini"
              inverted
            />
          ))}
        </Menu>
        <WorkMenu floated="left" focus={this.state.focus} className="full-height" />
      </div>
    )
  }
}

export default SideNav

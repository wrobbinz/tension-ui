import React, { Component } from 'react'
import { Sidebar, Segment, Menu, Icon, Popup } from 'semantic-ui-react'
import '../css/style.css'
import WorkMenu from './workMenu'


const DELAY = 500

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
        <Sidebar.Pushable as={Segment} className="no-border-radius no-border">
          <Sidebar
            as={Menu}
            width="very thin"
            animation="push"
            visible
            className="full-height sidenav"
            icon
            vertical
            inverted
          >
            <Popup
              trigger={
                <Menu.Item
                  onClick={() => { this.handleClick('notes') }}
                  active={this.state.focus === 'notes'}
                >
                  <Icon link size="large" name="sticky note" />
                </Menu.Item>
              }
              mouseEnterDelay={DELAY}
              content="Notes"
              position="right center"
              size="mini"
              inverted
            />
            <Popup
              trigger={
                <Menu.Item
                  onClick={() => { this.handleClick('tasks') }}
                  active={this.state.focus === 'tasks'}
                >
                  <Icon link size="large" name="tasks" />
                </Menu.Item>
              }
              mouseEnterDelay={DELAY}
              content="Tasks"
              position="right center"
              size="mini"
              inverted
            />
            <Popup
              trigger={
                <Menu.Item
                  onClick={() => { this.handleClick('sketches') }}
                  active={this.state.focus === 'sketches'}
                >
                  <Icon link size="large" name="paint brush" />
                </Menu.Item>
              }
              mouseEnterDelay={DELAY}
              content="Sketches"
              position="right center"
              size="mini"
              inverted
            />
            <Popup
              trigger={
                <Menu.Item
                  onClick={() => { this.handleClick('files') }}
                  active={this.state.focus === 'files'}
                >
                  <Icon link size="large" name="save" />
                </Menu.Item>
              }
              mouseEnterDelay={DELAY}
              content="Files"
              position="right center"
              size="mini"
              inverted
            />
          </Sidebar>
          <Sidebar.Pusher className="full-height">
            <WorkMenu focus={this.state.focus} />
          </Sidebar.Pusher>
        </Sidebar.Pushable>
      </div>
    )
  }
}

export default SideNav

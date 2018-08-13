import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SideNav from '../sideNav/sideNav';
import NoteApp from '../noteApp/noteApp';


class WorkSpace extends Component {
  static propTypes = {
    user: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    updateUser: PropTypes.func.isRequired,
    setUser: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      focus: 'notes',
      menuVisible: true,
    };
  }

  setFocus = (focus) => {
    let { menuVisible } = this.state;
    if (focus === this.state.focus) {
      menuVisible = !menuVisible;
    }
    this.setState({ focus, menuVisible });
  }

  appView = () => {
    const noteApp = (
      <NoteApp
        user={this.props.user}
        menuVisible={this.state.menuVisible}
        updateUser={this.props.updateUser}
      />
    );
    switch (this.state.focus) {
      case 'notes':
        return noteApp;
      default:
        return noteApp;
    }
  }

  render() {
    return (
      <div className="flex-wrapper">
        <div className="flex-shrink">
          <SideNav
            focus={this.state.focus}
            setFocus={this.setFocus}
          />
        </div>
        { this.appView() }
      </div>
    );
  }
}

export default WorkSpace;

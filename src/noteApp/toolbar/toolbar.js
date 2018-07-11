import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Menu, Input } from 'semantic-ui-react';
import Favorite from './favorite/favorite';
import NoteOptions from './noteOptions/noteOptions';
import './toolbar.css';


class Toolbar extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleChange = (event) => {
    const title = event.target.value;
    this.props.updateNote({ title }, true);
  }

  render() {
    return (
      <Menu secondary id="toolbar" className="no-margin">
        <Menu.Item className="no-margin">
          <Favorite
            note={this.props.note}
            updateNote={this.props.updateNote}
          />
        </Menu.Item>
        <Menu.Item className="title-input">
          <Input
            id="titleInput"
            className="no-border"
            size="big"
            placeholder="Title"
            value={this.props.note.title}
            maxLength="100"
            onChange={this.handleChange}
            transparent
            fluid
          />
        </Menu.Item>
        <Menu.Menu
          id="editorOptions"
          className="editor-options"
          position="right"
        >
          <Menu.Item>
            <NoteOptions
              note={this.props.note}
              copyNote={this.props.copyNote}
              deleteNote={this.props.deleteNote}
            />
          </Menu.Item>
        </Menu.Menu>
      </Menu>
    );
  }
}

Toolbar.propTypes = {
  note: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  updateNote: PropTypes.func,
  copyNote: PropTypes.func,
  deleteNote: PropTypes.func,
};

Toolbar.defaultProps = {
  note: {},
  updateNote: null,
  copyNote: null,
  deleteNote: null,
};

export default Toolbar;

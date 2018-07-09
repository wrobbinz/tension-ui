import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Menu, Input } from 'semantic-ui-react';
import Favorite from './favorite/favorite';
import './toolbar.css';


class Toolbar extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleChange = (event) => {
    const { note } = this.props;
    note.title = event.target.value;
    this.props.updateNoteDelay(note);
  }

  render() {
    return (
      <Menu secondary className="no-margin">
        <Menu.Item className="no-margin">
          <Favorite
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
            fluid
          />
        </Menu.Item>
        <Menu.Menu
          id="editorOptions"
          className="editor-options"
          position="right"
        >
          <Menu.Item>
            {/* <NoteOptions
                note={this.props.note}
                deleteNote={this.props.deleteNote}
                copyNote={this.props.copyNote}
                saveNote={this.props.saveNote}
              /> */}
          </Menu.Item>
        </Menu.Menu>
      </Menu>
    );
  }
}

Toolbar.propTypes = {
  note: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  updateNoteDelay: PropTypes.func,
};

Toolbar.defaultProps = {
  note: {},
  updateNoteDelay: null,
};

export default Toolbar;

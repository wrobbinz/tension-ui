import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Menu, Input } from 'semantic-ui-react';
import HeartButton from './heartButton/heartButton';


class Toolbar extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Menu secondary className="no-margin">
        <Menu.Item className="no-margin">
          <HeartButton />
        </Menu.Item>
        <Menu.Item className="title-input">
          <Input
            id="titleInput"
            className="no-border"
            size="big"
            placeholder="Title"
            value={this.props.note ? this.props.note.title : ''}
            maxLength="100"
            onChange={this.handleTitleChange}
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

export default Toolbar;

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Menu, Input, Rating } from 'semantic-ui-react';
import Tags from './tags/tags';
import MarkdownShortcuts from './plugins/markdown';
import './noteEditor.css';


Quill.register('modules/MarkdownShortcuts', MarkdownShortcuts);


class NoteEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: this.props.note.title,
      text: '',
    };
  }

  onChange = (editorState) => {
    this.props.updateContent(editorState);
  }

  handleChange = (value) => {
    this.setState({ text: value });
  }

  handleTitleChange = (event) => {
    const newTitle = event.target.value;
    if (newTitle !== this.state.title) {
      this.setState({
        title: newTitle,
      });
    }
    this.props.updateTitle(event);
  }

  handleRating = (rating) => {
    this.props.updateRating(rating);
  }

  isFavorite = () => {
    if (this.props.note.is_favorite) {
      return 1;
    }
    return 0;
  }

  render() {
    return (
      <div className="editor flex-grow">
        <Menu secondary className="no-margin">
          <Menu.Item className="no-margin">
            <Rating
              icon="heart"
              className="favorite"
              onRate={(event, data) => this.handleRating(data.rating)}
              rating={this.isFavorite()}
              maxRating={1}
            />
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
        <ReactQuill
          value={this.state.text}
          onChange={this.handleChange}
          modules={{
            MarkdownShortcuts: {},
          }}
          // className="full-height flex-grow"
        />
        <Menu secondary className="no-margin">
          <Menu.Item className="full-width">
            <Tags
              note={this.props.note}
              userTags={this.props.userTags}
              addUserTag={this.props.addUserTag}
              updateNoteTags={this.props.updateNoteTags}
              placeholder="# Tags"
            />
          </Menu.Item>
        </Menu>
      </div>
    );
  }
}

NoteEditor.propTypes = {
  isSaved: PropTypes.bool,
  updateTitle: PropTypes.func,
  updateContent: PropTypes.func,
  updateRating: PropTypes.func,
  note: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  editorState: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  userTags: PropTypes.array, // eslint-disable-line react/forbid-prop-types
  addUserTag: PropTypes.func,
  updateNoteTags: PropTypes.func,
};

NoteEditor.defaultProps = {
  isSaved: false,
  updateTitle: false,
  updateContent: false,
  updateRating: null,
  note: null,
  editorState: null,
  userTags: null,
  addUserTag: null,
  updateNoteTags: null,
};

export default NoteEditor;

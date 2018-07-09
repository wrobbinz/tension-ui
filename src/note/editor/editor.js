import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.bubble.css';
import MarkdownShortcuts from './plugins/quillMarkdown';
import ToolbarOptions from './plugins/quillToolbar';
import './editor.css';


Quill.register('modules/MarkdownShortcuts', MarkdownShortcuts);

class Editor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: this.props.note.title,
      text: '',
    };

    this.modules = {
      MarkdownShortcuts: {},
      toolbar: ToolbarOptions,
      syntax: true,
    };
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

  render() {
    return (
      <div className="editor flex-grow">
        <ReactQuill
          id="quillEditor"
          value={this.state.text}
          onChange={this.handleChange}
          modules={this.modules}
          theme="bubble"
          tabIndex={0}
          className="full-height flex-grow"
        />
      </div>
    );
  }
}

Editor.propTypes = {
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

Editor.defaultProps = {
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

export default Editor;

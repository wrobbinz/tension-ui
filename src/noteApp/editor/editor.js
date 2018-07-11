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
      noteId: this.props.note.id,
    };

    this.quillRef = null;
    this.reactQuillRef = null;

    this.modules = {
      MarkdownShortcuts: {},
      toolbar: ToolbarOptions,
    };
  }

  componentDidMount() {
    this.attachQuillRefs();
  }

  componentDidUpdate() {
    this.attachQuillRefs();
  }

  attachQuillRefs = () => {
    if (typeof this.reactQuillRef.getEditor !== 'function') return;
    this.quillRef = this.reactQuillRef.getEditor();
  }

  handleChange = () => {
    if (this.props.note.id !== this.state.noteId) {
      this.setState({ noteId: this.props.note.id });
      return;
    }
    const content = this.quillRef.getContents();
    this.props.updateNote({ content }, true);
  }

  render() {
    return (
      <ReactQuill
        id="quillEditor"
        className="full-height flex-grow"
        value={this.props.note.content}
        onChange={this.handleChange}
        ref={(el) => { this.reactQuillRef = el; }}
        modules={this.modules}
        theme="bubble"
        tabIndex={0}
      />
    );
  }
}

Editor.propTypes = {
  note: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  updateNote: PropTypes.func,
};

Editor.defaultProps = {
  note: {},
  updateNote: null,
};

export default Editor;

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Editor from 'draft-js-plugins-editor'
import createMarkdownShortcutsPlugin from 'draft-js-markdown-shortcuts-plugin'
import { EditorState } from 'draft-js'
import { Input } from 'semantic-ui-react'

const plugins = [
  createMarkdownShortcutsPlugin(),
]

class NoteEditor extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }

  onChange = (editorState) => {
    this.props.updateContent(editorState)
  }

  render() {
    return (
      <div className="editor float-left">
        <Input
          id="titleInput"
          className="no-border full-width"
          size="big"
          placeholder="Title"
          value={this.props.note ? this.props.note.title : ''}
          maxLength="20"
          onChange={this.props.updateTitle}
        />
        <Editor
          className="full-height"
          editorState={this.props.note.content || EditorState.createEmpty()}
          onChange={this.onChange}
          plugins={plugins}
        />
      </div>
    )
  }
}

NoteEditor.propTypes = {
  updateTitle: PropTypes.func,
  updateContent: PropTypes.func,
  note: PropTypes.object, // eslint-disable-line react/forbid-prop-types
}

NoteEditor.defaultProps = {
  updateTitle: false,
  updateContent: false,
  note: null,
}

export default NoteEditor

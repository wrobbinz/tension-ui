import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Editor from 'draft-js-plugins-editor'
import createMarkdownShortcutsPlugin from 'draft-js-markdown-shortcuts-plugin'
import { EditorState } from 'draft-js'
// import { Input, Form, TextArea } from 'semantic-ui-react'


const plugins = [
  createMarkdownShortcutsPlugin(),
]

class NoteEditor extends Component {
  constructor(props) {
    super(props)
    this.state = {
      editorState: EditorState.createEmpty(),
    }
  }

  onChange = (editorState) => {
    this.setState({
      editorState,
    })
  }

  handleChange = (event) => {
    const markdown = event.target.value
    this.setState({ markdown })
    this.props.updateContents(markdown)
  }

  render() {
    return (
      <div className="editor float-left">
        <Editor
          className="full-height"
          editorState={this.state.editorState}
          onChange={this.onChange}
          plugins={plugins}
        />
      </div>
    )
  }
}

NoteEditor.propTypes = {
  updateTitle: PropTypes.func,
  updateContents: PropTypes.func,
  note: PropTypes.object, // eslint-disable-line react/forbid-prop-types
}

NoteEditor.defaultProps = {
  updateTitle: false,
  updateContents: false,
  note: null,
}

export default NoteEditor

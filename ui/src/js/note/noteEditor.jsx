import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Editor from 'draft-js-plugins-editor'
import createMarkdownShortcutsPlugin from 'draft-js-markdown-shortcuts-plugin'
import { Menu, Input, Icon } from 'semantic-ui-react'
import Tags from '../tags'

const plugins = [
  createMarkdownShortcutsPlugin(),
]

class NoteEditor extends Component {
  constructor(props) {
    super(props)
    this.state = {
      title: this.props.note.title,
      noteSaved: true,
      contentState: this.props.editorState.getCurrentContent(),
    }
  }

  onChange = (editorState) => {
    const newContentState = editorState.getCurrentContent()
    if (newContentState !== this.state.contentState) {
      console.log('they dont match', newContentState !== this.state.contentState)
      this.setState({
        contentState: newContentState,
        noteSaved: false,
      })
    }
    this.props.updateContent(editorState)
  }

  handleTitleChange = (event) => {
    const newTitle = event.target.value
    if (newTitle !== this.state.title) {
      this.setState({
        title: newTitle,
        noteSaved: false,
      })
    }
    this.props.updateTitle(event)
  }

  handleSave() {
    const { id } = this.props.note
    this.props.saveNote(id)
    this.setState({ noteSaved: true })
  }

  render() {
    return (
      <div className="editor float-left">
        <Menu secondary className="editor-menu">
          <Menu.Item>
            {this.state.noteSaved ?
              <Icon
                name="check circle"
                size="large"
                className="no-margin"
                color="green"
              /> :
              <Icon
                loading
                name="refresh"
                size="large"
                className="no-margin pointer"
                color="grey"
                onClick={() => { this.handleSave() }}
              />
            }
          </Menu.Item>
          <Menu.Item className="title-input">
            <Input
              id="titleInput"
              className="no-border full-width"
              size="big"
              placeholder="Title"
              value={this.props.note ? this.props.note.title : ''}
              maxLength="20"
              onChange={this.handleTitleChange}
            />
          </Menu.Item>
          <Menu.Menu position="right">
            <Menu.Item>
              <Tags
                note={this.props.note}
                userTags={this.props.userTags}
                addUserTag={this.props.addUserTag}
                updateNoteTags={this.props.updateNoteTags}
                placeholder="Tags"
              />
            </Menu.Item>
          </Menu.Menu>
        </Menu>
        <Editor
          className="full-height"
          editorState={this.props.editorState}
          onChange={this.onChange}
          plugins={plugins}
        />
      </div>
    )
  }
}

NoteEditor.propTypes = {
  saveNote: PropTypes.func,
  updateTitle: PropTypes.func,
  updateContent: PropTypes.func,
  note: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  editorState: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  userTags: PropTypes.array, // eslint-disable-line react/forbid-prop-types
  addUserTag: PropTypes.func,
  updateNoteTags: PropTypes.func,
}

NoteEditor.defaultProps = {
  saveNote: null,
  updateTitle: false,
  updateContent: false,
  note: null,
  editorState: null,
  userTags: null,
  addUserTag: null,
  updateNoteTags: null,
}

export default NoteEditor

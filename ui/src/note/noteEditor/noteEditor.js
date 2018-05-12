import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Editor, { composeDecorators } from 'draft-js-plugins-editor'
import createMarkdownPlugin from 'draft-js-markdown-plugin'
import createImagePlugin from 'draft-js-image-plugin'
import 'draft-js-image-plugin/lib/plugin.css'
import createUndoPlugin from 'draft-js-undo-plugin'
import createFocusPlugin from 'draft-js-focus-plugin'
import createResizeablePlugin from 'draft-js-resizeable-plugin'
import { stateToMarkdown } from 'draft-js-export-markdown'
import Prism from 'prismjs'
import 'draft-js/dist/Draft.css'
import 'prismjs/components/prism-java'
import 'prismjs/components/prism-scala'
import 'prismjs/components/prism-go'
import 'prismjs/components/prism-sql'
import 'prismjs/components/prism-bash'
import 'prismjs/components/prism-c'
import 'prismjs/components/prism-cpp'
import 'prismjs/components/prism-kotlin'
import 'prismjs/components/prism-perl'
import 'prismjs/components/prism-ruby'
import 'prismjs/components/prism-swift'
import createPrismPlugin from 'draft-js-prism-plugin'
import createLinkifyPlugin from 'draft-js-linkify-plugin'
import { Menu, Input, Icon, Loader, Button, Rating } from 'semantic-ui-react'
import Tags from './tags/tags'


import './CheckableListItem.css'
import './prism.css'

const undoPlugin = createUndoPlugin()
const prismPlugin = createPrismPlugin({
  prism: Prism,
})

const { UndoButton, RedoButton } = undoPlugin

const focusPlugin = createFocusPlugin()
const resizeablePlugin = createResizeablePlugin()

const decorator = composeDecorators(
  resizeablePlugin.decorator,
  focusPlugin.decorator,
)

const imagePlugin = createImagePlugin({ decorator })

const entityType = {
  IMAGE: 'IMAGE',
}

const markdownPlugin = createMarkdownPlugin({ entityType })

const linkifyPlugin = createLinkifyPlugin()

const plugins = [
  linkifyPlugin,
  focusPlugin,
  resizeablePlugin,
  imagePlugin,
  undoPlugin,
  prismPlugin,
  markdownPlugin,
]

class NoteEditor extends Component {
  constructor(props) {
    super(props)
    this.state = {
      title: this.props.note.title,
      isFavorite: this.props.note.is_favorite,
    }
  }

  onChange = (editorState) => {
    this.props.updateContent(editorState)
  }

  handleTitleChange = (event) => {
    const newTitle = event.target.value
    if (newTitle !== this.state.title) {
      this.setState({
        title: newTitle,
      })
    }
    this.props.updateTitle(event)
  }

  handleRating = (rating) => {
    this.props.updateRating(rating)
  }

  convertToMarkdown = (event) => {
    const contentState = this.props.editorState.getCurrentContent()
    console.log(stateToMarkdown(contentState))
  }

  isFavorite = () => {
    if (this.props.note.is_favorite) {
      return 1
    } else {
      return 0
    }
  }

  render() {
    return (
      <div className="editor flex-grow">
        <Menu secondary className="editor-menu">
          <Menu.Item>
            {this.props.isSaved ?
              <Icon
                name="check circle"
                className="no-margin"
                color="green"
                size="large"
              /> :
              <Icon>
                <Loader active size="small" />
              </Icon>
            }
          </Menu.Item>
          <Menu.Item className="title-input">
            <Input
              id="titleInput"
              className="no-border full-width"
              size="big"
              placeholder="Title"
              value={this.props.note ? this.props.note.title : ''}
              maxLength="30"
              onChange={this.handleTitleChange}
            />
          </Menu.Item>
          <Menu.Menu position="right">
            <Menu.Item>
              <Button onClick={event => this.convertToMarkdown(event)} size="tiny">
                Convert
              </Button>
            </Menu.Item>
            <Menu.Item>
              <UndoButton as={Button} />
              <RedoButton as={Button} />
            </Menu.Item>
            <Menu.Item>
              <Rating
                icon="heart"
                className="favorite"
                onRate={(event, data) => this.handleRating(data.rating)}
                rating={this.isFavorite()}
                maxRating={1}
              />
            </Menu.Item>
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
          className="full-height flex-grow"
          editorState={this.props.editorState}
          onChange={this.onChange}
          plugins={plugins}
          placeholder="..."
          spellCheck
          ref={(element) => { this.editor = element }}
        />
      </div>
    )
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
}

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
}

export default NoteEditor

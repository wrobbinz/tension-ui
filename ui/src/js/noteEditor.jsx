import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Input, TextArea } from 'semantic-ui-react'
import ContentEditable from 'react-contenteditable'


class NoteEditor extends Component {
  constructor(props) {
    super(props)
    this.state = {
      html: this.props.note.contents,
    }
  }

  handleChange = (event) => {
    const html = event.target.value
    this.setState({ html })
    this.props.updateContents(html)
  }

  render() {
    return (
      <div id="editor">
        <Input
          id="titleInput"
          className="no-border"
          size="big"
          placeholder="Title"
          value={this.props.note ? this.props.note.title : ''}
          maxLength="20"
          onChange={this.props.updateTitle}
        />
        <ContentEditable
          className="full-height"
          html={this.props.html}
          disabled={false}
          onChange={this.handleChange}
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
  note: false,
}

export default NoteEditor

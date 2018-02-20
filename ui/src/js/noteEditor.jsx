import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Input, Form, TextArea } from 'semantic-ui-react'


class NoteEditor extends Component {
  constructor(props) {
    super(props)
    this.state = {
      value: '',
    }
  }

  handleChange = (event) => {
    const markdown = event.target.value
    this.setState({ markdown })
    this.props.updateContents(markdown)
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
        <Form className="full-height">
          <TextArea
            id="editor"
            className="no-border-radius no-border"
            value={this.props.note.contents}
            onChange={this.handleChange}
            placeholder="_"
            style={{ minHeight: '100%' }}
          />
        </Form>
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

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Input, TextArea } from 'semantic-ui-react'


class NoteEditor extends Component {
  constructor(props) {
    super(props)
    this.state = {

    }
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
        <Form className="full-height">
          <TextArea
            id="editor"
            className="no-border-radius no-border"
            value={this.props.note ? this.props.note.contents : ''}
            onChange={this.props.updateContents}
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
  note: false,
}

export default NoteEditor

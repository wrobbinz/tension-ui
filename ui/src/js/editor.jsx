import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, TextArea } from 'semantic-ui-react'


class Editor extends Component {
  constructor(props) {
    super(props)
    this.state = {

    }
  }

  render() {
    return (
      <Form className="full-height">
        <TextArea
          id="editor"
          className="no-border-radius no-border"
          value={this.props.note.contents}
          onChange={this.props.updateContents}
          placeholder="_"
          style={{ minHeight: '100%' }}
        />
      </Form>
    )
  }
}

Editor.propTypes = {
  updateContents: PropTypes.func,
  note: PropTypes.object, // eslint-disable-line react/forbid-prop-types
}

Editor.defaultProps = {
  updateContents: false,
  note: false,
}

export default Editor

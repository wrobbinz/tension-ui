import React, { Component } from 'react'
import { Form, TextArea } from 'semantic-ui-react'
import axios from 'axios'


class Editor extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }

  render() {
    return (
      <Form>
        <TextArea value={this.state.noteValue} onChange={(event, newValue) => this.setState({ noteValue: newValue })} placeholder="Tell us more" style={{ minHeight: '100%' }} />
      </Form>
    )
  }
}

export default Editor

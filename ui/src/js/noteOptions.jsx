import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Popup, List, Icon } from 'semantic-ui-react'


class NoteOptions extends Component {
  constructor(props) {
    super(props)
    this.state = {

    }
  }

  handleCopy() {
    const { id } = this.props.note
    this.props.copyNote(id)
  }
  handleDelete() {
    const { id } = this.props.note
    this.props.deleteNote(id)
  }

  render() {
    return (
      <Popup
        trigger={<Icon name="ellipsis horizontal" link />}
        content={
          <List>
            <List.Item
              icon="copy"
              onClick={() => this.handleCopy()}
              content="Duplicate"
              className="pointer"
            />
          </List>
        }
        on="click"
        position="right center"
      />
    )
  }
}

NoteOptions.propTypes = {
  deleteNote: PropTypes.func,
  note: PropTypes.object, // eslint-disable-line react/forbid-prop-types
}

NoteOptions.defaultProps = {
  deleteNote: false,
  note: false,
}

export default NoteOptions

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Popup, List, Icon } from 'semantic-ui-react'


class NoteOptions extends Component {
  constructor(props) {
    super(props)
    this.state = {

    }
  }

  handleClick() {
    const { id } = this.props.note
    this.props.deleteNote(id)
  }

  render() {
    return (
      <Popup
        trigger={<Icon name="ellipsis horizontal" link />}
        content={
          <List>
            <List.Item icon="copy" content="Duplicate" />
            <List.Item icon="share" content="Share" />
            <List.Item
              icon="trash outline"
              content={<a onClick={() => this.handleClick()} href="#">Delete</a>}
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

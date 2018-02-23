import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Popup, List, Icon, Modal, Header, Button } from 'semantic-ui-react'


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
        trigger={<Icon name="ellipsis horizontal" link disabled size="large" />}
        on="click"
        position="right center"
        content={
          <List>
            <List.Item
              icon="copy"
              onClick={() => this.handleCopy()}
              content="Duplicate"
              className="pointer"
            />
            <List.Item icon="share" content="Share" />
            <Modal
              trigger={
                <List.Item
                  icon="trash outline"
                  content="Delete"
                  className="pointer"
                />
              }
              basic
              size="small"
            >
              <Header
                icon="trash"
                content={
                  `Delete ${this.props.note.title === '' ? 'untitled' : `"${this.props.note.title}"`} note?`
                }
              />
              <Modal.Content>
                <p>Are you sure you want to delete this note? (This action cannot be undone)</p>
              </Modal.Content>
              <Modal.Actions>
                <Button basic color="grey" inverted>
                  <Icon name="remove" /> Cancel
                </Button>
                <Button color="red" onClick={() => this.handleDelete()} inverted>
                  <Icon name="remove" /> Delete
                </Button>
              </Modal.Actions>
            </Modal>
          </List>
        }
      />
    )
  }
}

NoteOptions.propTypes = {
  copyNote: PropTypes.func,
  deleteNote: PropTypes.func,
  note: PropTypes.object, // eslint-disable-line react/forbid-prop-types
}

NoteOptions.defaultProps = {
  copyNote: false,
  deleteNote: false,
  note: false,
}

export default NoteOptions

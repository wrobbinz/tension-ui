import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { Menu, Icon, Rating } from 'semantic-ui-react'
import NoteOptions from './noteOptions/noteOptions'
import Search from './search/search'

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)
  return result
}

class NoteMenu extends Component {
  constructor(props) {
    super(props)
    this.state = {
      searchValue: '',
      showFavorites: false,
    }
  }

  onDragEnd = (result) => {
    // dropped outside the list
    if (!result.destination) {
      return
    }

    const notes = reorder(
      this.props.notes,
      result.source.index,
      result.destination.index,
    )

    this.props.updateOrder(notes)
  }

  updateSearchValue = (value) => {
    this.setState({ searchValue: value })
  }

  matchNotes = () => {
    if (this.state.showFavorites) {
      return this.props.notes.filter(note => note.is_favorite)
    }
    if (this.state.searchValue) {
      const searchValue = this.state.searchValue.toLowerCase()
      const matchedNotes = this.props.notes.filter((note) => {
        let found = false
        note.tags.forEach((tag) => {
          if (tag.value.toLowerCase().includes(searchValue)) {
            found = true
          }
        })
        note.content.blocks.forEach((block) => {
          if (block.text.toLowerCase().includes(searchValue)) {
            found = true
          }
        })
        if (note.title.toLowerCase().includes(searchValue)) {
          found = true
        }
        return found
      })
      return matchedNotes
    }
    return this.props.notes
  }

  render() {
    return (
      <Menu size="large" pointing secondary vertical className="full-height" floated>
        <Menu.Item>
          <span className="menu-header">
            Notes
            <Rating
              icon="heart"
              className="favorite"
              onRate={() => this.setState({ showFavorites: !this.state.showFavorites })}
              maxRating={1}
            />
          </span>
          <Icon
            link
            onClick={() => { this.props.createNote() }}
            size="large"
            name="plus"
            floated="right"
            className="create-new"
          />
        </Menu.Item>
        <Menu.Item>
          <Search
            searchValue={this.state.searchValue}
            userTags={this.props.userTags}
            updateSearchValue={this.updateSearchValue}
            placeholder="Search..."
          />
        </Menu.Item>
        <DragDropContext onDragEnd={this.onDragEnd} className="note-list">
          <Droppable droppableId="droppable">
            {provided => (
              <div
                className="note-list"
                ref={provided.innerRef}
              >
                {this.matchNotes().map((note, index) => (
                  <Draggable key={note.id} draggableId={note.id} index={index}>
                    {prov => (
                      <div>
                        <div
                          ref={prov.innerRef}
                          {...prov.draggableProps}
                          {...prov.dragHandleProps}
                        >
                          <Menu.Item
                            onClick={() => { this.props.selectNote(note.id) }}
                            name={note.id.toString()}
                            active={this.props.note.id === note.id}
                            id={note.id}
                          >
                            <Icon name="file outline" className="note-icon" />
                            {note.title === '' ? 'Untitled Note' : note.title}
                            <NoteOptions
                              note={this.props.note}
                              deleteNote={this.props.deleteNote}
                              copyNote={this.props.copyNote}
                              saveNote={this.props.saveNote}
                            />
                          </Menu.Item>
                        </div>
                        {prov.placeholder}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </Menu>
    )
  }
}

NoteMenu.propTypes = {
  notes: PropTypes.array, // eslint-disable-line react/forbid-prop-types
  note: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  selectNote: PropTypes.func,
  createNote: PropTypes.func,
  copyNote: PropTypes.func,
  deleteNote: PropTypes.func,
  updateOrder: PropTypes.func,
  saveNote: PropTypes.func,
  userTags: PropTypes.array, // eslint-disable-line react/forbid-prop-types
}

NoteMenu.defaultProps = {
  notes: false,
  note: null,
  selectNote: false,
  createNote: false,
  copyNote: false,
  deleteNote: false,
  updateOrder: false,
  saveNote: null,
  userTags: null,
}

export default NoteMenu

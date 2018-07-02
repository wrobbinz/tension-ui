import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { Menu, Icon } from 'semantic-ui-react'
import Search from '../search'

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)
  return result
}

class BoardMenu extends Component {
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
            Board
          </span>
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

BoardMenu.propTypes = {
  notes: PropTypes.array, // eslint-disable-line react/forbid-prop-types
  note: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  userTags: PropTypes.array, // eslint-disable-line react/forbid-prop-types
}

BoardMenu.defaultProps = {
  notes: false,
  note: null,
  userTags: null,
}

export default BoardMenu

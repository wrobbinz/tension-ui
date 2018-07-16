import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Resizable from 're-resizable';
import { Menu, List, Icon, Button } from 'semantic-ui-react';
import Search from './search/search';
import './noteMenu.css';

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

const resizeDirections = {
  top: false,
  right: true,
  bottom: false,
  left: false,
  topRight: false,
  bottomRight: false,
  bottomLeft: false,
  topLeft: false,
};

class NoteMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search: '',
      view: 'all',
    };
  }

  onDragEnd = (result) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const notes = reorder(
      this.props.notes,
      result.source.index,
      result.destination.index,
    );

    this.props.updateOrder(notes);
  }

  updateSearch = (value) => {
    this.setState({ search: value });
  }

  matchNotes = () => {
    if (this.state.view === 'favorites') {
      return this.props.notes.filter(note => note.favorite);
    }
    if (this.state.search) {
      const search = this.state.search.toLowerCase();
      return this.props.notes.filter((note) => {
        const matchedTags = note.tags.map(tag => tag.toLowerCase()).includes(search);
        const matchedTitle = note.title.toLowerCase().includes(search);
        return matchedTags || matchedTitle;
      });
    }
    return this.props.notes;
  }

  handleViewChange = view => this.setState({ view })

  handleSelect = (e, data) => {
    const { note } = data;
    this.props.selectNote(note);
  }

  render() {
    return (
      <Resizable
        className="resize-indicator"
        minWidth="250"
        maxWidth="40%"
        defaultSize={{ width: 250 }}
        enable={resizeDirections}
      >
        <Menu
          className="note-menu full-height full-width"
          size="large"
          pointing
          secondary
          vertical
          floated
        >
          <Menu.Item>
            <Search
              search={this.state.search}
              updateSearch={this.updateSearch}
              createNote={this.props.createNote}
            />
          </Menu.Item>
          <Menu.Item>
            <List>
              <DragDropContext onDragEnd={this.onDragEnd}>
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
                                <List.Item
                                  className="note-list-item truncate"
                                  note={note}
                                  onClick={this.handleSelect}
                                  name={note.id.toString()}
                                  active={this.props.note.id === note.id}
                                  id={note.id}
                                >
                                  <List.Icon
                                    className="note-icon"
                                    name={this.props.note.id === note.id ? 'sticky note' : 'sticky note outline'}
                                  />
                                  <List.Description>
                                    {note.title === '' ? 'Untitled Note' : note.title}
                                  </List.Description>
                                </List.Item>
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
            </List>
          </Menu.Item>
          <Menu.Item id="noteView">
            <Button.Group size="mini" widths="3" fluid basic>
              <Button
                onClick={() => { this.handleViewChange('all'); }}
                active={this.state.view === 'all'}
              >
                All
              </Button>
              <Button
                onClick={() => { this.handleViewChange('tags'); }}
                active={this.state.view === 'tags'}
              >
                Tags
              </Button>
              <Button
                onClick={() => { this.handleViewChange('favorites'); }}
                active={this.state.view === 'favorites'}
                icon
              >
                <Icon
                  color={this.state.view === 'favorites' ? 'red' : 'grey'}
                  name="heart"
                />
              </Button>
            </Button.Group>
          </Menu.Item>
        </Menu>
      </Resizable>
    );
  }
}

NoteMenu.propTypes = {
  user: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  notes: PropTypes.array, // eslint-disable-line react/forbid-prop-types
  note: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  selectNote: PropTypes.func,
  createNote: PropTypes.func,
};

NoteMenu.defaultProps = {
  user: {},
  notes: false,
  note: null,
  selectNote: false,
  createNote: false,
};

export default NoteMenu;

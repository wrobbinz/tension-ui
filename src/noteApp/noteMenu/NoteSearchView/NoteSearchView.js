import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { List, Header } from 'semantic-ui-react';
import './NoteSearchView.css';


class NoteFavView extends Component {
  static propTypes = {
    search: PropTypes.string.isRequired,
    notes: PropTypes.arrayOf(PropTypes.object).isRequired,
    selectNote: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  resolveMatchedNotes = (search, notes) => notes
    .filter((note) => {
      const searchTerm = search.toLowerCase();
      const title = note.title.toLowerCase();
      const tags = note.tags.join('');

      const matchesTitle = title.includes(searchTerm);
      const matchesTags = tags.includes(searchTerm);
      return matchesTitle || matchesTags;
    })

  handleNoteClick = (e, { note }) => {
    this.props.selectNote(note);
  }

  render() {
    const { search, notes } = this.props;
    const matchingNotes = this.resolveMatchedNotes(search, notes);

    return (
      <List>
        {
          matchingNotes.length ? matchingNotes.map(note => (
            <List.Item
              onClick={this.handleNoteClick}
              className="pointer"
              note={note}
              key={note.id}
            >
              <List.Icon name="sticky note outline" className="note-icon" />
              <List.Content>
                <List.Description>{note.title || 'Untitled Note'}</List.Description>
              </List.Content>
            </List.Item>
          )) : (
            <Header as="h5" color="grey" textAlign="center">
              <em>
                No notes match your search
              </em>
            </Header>
          )
        }
      </List>
    );
  }
}

export default NoteFavView;

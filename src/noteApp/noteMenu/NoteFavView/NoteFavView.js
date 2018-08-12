import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { List } from 'semantic-ui-react';
import { union } from 'lodash';
import './NoteFavView.css';


class NoteFavView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hiddenTags: [],
    };
  }

  resolveTags = notes => union(...notes.map(n => n.tags))

  resolveFavorites = notes => notes.filter(note => note.favorite)

  handleTagClick = (e, data) => {
    const { hiddenTags } = this.state;
    const clickedTag = data.value;
    const isHidden = hiddenTags.includes(clickedTag);

    const newHiddenTags = isHidden ?
      hiddenTags.filter(tag => tag !== clickedTag) : [clickedTag, ...hiddenTags];

    this.setState({ hiddenTags: newHiddenTags });
  }

  handleNoteClick = (e, { note }) => {
    this.props.selectNote(note);
  }

  render() {
    const { notes } = this.props;
    const favoriteNotes = this.resolveFavorites(notes);

    return (
      <List>
        {
          favoriteNotes.map(note => (
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
          ))
        }
      </List>
    );
  }
}

NoteFavView.propTypes = {
  notes: PropTypes.array, // eslint-disable-line react/forbid-prop-types
  selectNote: PropTypes.func,
};

NoteFavView.defaultProps = {
  notes: [],
  selectNote: null,
};

export default NoteFavView;

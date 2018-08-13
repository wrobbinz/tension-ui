import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { List } from 'semantic-ui-react';
import { union } from 'lodash';
import './NoteTagView.css';


class NoteTagView extends Component {
  static propTypes = {
    notes: PropTypes.arrayOf(PropTypes.object).isRequired,
    selectNote: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      hiddenTags: [],
    };
  }

  resolveTags = notes => union(...notes.map(n => n.tags))

  matchNotesToTag = (notes, tag) => notes.filter(note => note.tags.includes(tag))

  handleTagClick = (e, { tag }) => {
    const { hiddenTags } = this.state;
    const isHidden = hiddenTags.includes(tag);

    const newHiddenTags = isHidden ?
      hiddenTags.filter(hiddenTag => hiddenTag !== tag) : [tag, ...hiddenTags];

    this.setState({ hiddenTags: newHiddenTags });
  }

  handleNoteClick = (e, { note }) => {
    e.stopPropagation();
    this.props.selectNote(note);
  }

  renderNote = note => (
    <List.Item onClick={this.handleNoteClick} note={note} key={note.id}>
      <List.Icon name="sticky note outline" className="note-icon" />
      <List.Content>
        <List.Description>{note.title || 'Untitled Note'}</List.Description>
      </List.Content>
    </List.Item>
  )

  render() {
    const { notes } = this.props;
    const tags = this.resolveTags(notes);
    const { hiddenTags } = this.state;
    return (
      <List>
        {
          tags.map((tag) => {
            const taggedNotes = this.matchNotesToTag(notes, tag);
            return (
              <List.Item
                onClick={this.handleTagClick}
                className="pointer"
                tag={tag}
                key={tag}
              >
                <List.Icon name="slack hash" className="note-icon" />
                <List.Content>
                  <List.Header>{tag}</List.Header>
                  <List.List>
                    {
                      !hiddenTags.includes(tag) ?
                        taggedNotes.map(note => this.renderNote(note)) : null
                    }
                  </List.List>
                </List.Content>
              </List.Item>
            );
          })
        }
      </List>
    );
  }
}

export default NoteTagView;

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Input, Button } from 'semantic-ui-react';
import './noteSearch.css';


class NoteSearch extends Component {
  static propTypes = {
    createNote: PropTypes.func.isRequired,
    search: PropTypes.string.isRequired,
    updateSearch: PropTypes.func.isRequired,
    addTreeLeaf: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  handleChange = (e, { value }) => {
    this.props.updateSearch(value);
  }

  handleCreate = async () => {
    const note = await this.props.createNote();
    this.props.addTreeLeaf(note);
  }

  render() {
    return (
      <Input
        className="note-search"
        size="mini"
        placeholder="Search Notes..."
        value={this.props.search}
        onChange={this.handleChange}
        iconPosition="left"
        icon="search"
        action={
          <Button
            icon="edit outline"
            onClick={this.handleCreate}
          />
        }
        compact="true"
      />
    );
  }
}

export default NoteSearch;

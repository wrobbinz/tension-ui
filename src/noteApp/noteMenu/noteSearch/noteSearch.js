import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Input, Button } from 'semantic-ui-react';
import './noteSearch.css';


class NoteSearch extends Component {
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

NoteSearch.propTypes = {
  createNote: PropTypes.func,
  search: PropTypes.string,
  updateSearch: PropTypes.func,
  addTreeLeaf: PropTypes.func,
};

NoteSearch.defaultProps = {
  createNote: null,
  search: '',
  updateSearch: null,
  addTreeLeaf: null,
};

export default NoteSearch;

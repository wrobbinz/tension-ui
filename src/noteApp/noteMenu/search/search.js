import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Input, Button } from 'semantic-ui-react';
import './search.css';


class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleChange = (e, { value }) => {
    this.props.updateSearchValue(value);
  }

  handleCreate = () => {
    this.props.createNote();
  }

  render() {
    return (
      <Input
        className="note-search"
        size="mini"
        placeholder="Search Notes..."
        value={this.props.searchValue}
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

Search.propTypes = {
  createNote: PropTypes.func,
  searchValue: PropTypes.string,
  searchTags: PropTypes.array, // eslint-disable-line react/forbid-prop-types
  updateSearchValue: PropTypes.func,
};

Search.defaultProps = {
  createNote: null,
  searchValue: '',
  searchTags: null,
  updateSearchValue: null,
};

export default Search;

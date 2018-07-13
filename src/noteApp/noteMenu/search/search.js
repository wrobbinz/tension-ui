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
    this.props.updateSearch(value);
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

Search.propTypes = {
  createNote: PropTypes.func,
  search: PropTypes.string,
  updateSearch: PropTypes.func,
};

Search.defaultProps = {
  createNote: null,
  search: '',
  updateSearch: null,
};

export default Search;

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Rating } from 'semantic-ui-react';


class Favorite extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleChange = (e, data) => {
    const { rating } = data;
    this.props.updateNote({ favorite: rating === 1 });
  }

  isFavorite = () => (this.props.note.favorite ? 1 : 0);

  render() {
    return (
      <Rating
        icon="heart"
        className="favorite"
        onRate={this.handleChange}
        rating={this.isFavorite()}
        maxRating={1}
      />
    );
  }
}

Favorite.propTypes = {
  note: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  updateNote: PropTypes.func,
};

Favorite.defaultProps = {
  note: {},
  updateNote: null,
};

export default Favorite;

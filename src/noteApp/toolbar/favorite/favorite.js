import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Rating } from 'semantic-ui-react';


class Favorite extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleChange = (event, data) => {
    const { rating } = data;
    this.props.updateRating(rating);
  }

  isFavorite = () => {
    if (this.props.note && this.props.note.is_favorite) {
      return 1;
    }
    return 0;
  }

  render() {
    return (
      <Rating
        icon="heart"
        className="favorite"
        onRate={(event, data) => this.handleChange(event, data)}
        rating={this.isFavorite()}
        maxRating={1}
      />
    );
  }
}

export default Favorite;

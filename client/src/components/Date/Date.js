import React from 'react';

export default class Date extends React.Component {
  static propTypes = {
    timestamp: React.PropTypes.number.isRequired
  };

  render () {
    return (
      <span>{this.props.timestamp}</span>
    );
  }
}

import React from 'react';

export default class Board extends React.Component {
  render () {
    const {name} = this.props.list;
    if (!name) {
      return (
        <div />
      );
    }

    return (
      <div>
        <h1>/{name}</h1>
        <pre>{JSON.stringify(this.props.board, null, 2)}</pre>
      </div>
    );
  }

  static propTypes = {
    list: React.PropTypes.object.isRequired,
    board: React.PropTypes.object.isRequired
  };
}


import React from 'react';

import Slot from '../Slot';

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
        {this.renderSlots()}
        <pre>{JSON.stringify(this.props.board, null, 2)}</pre>
      </div>
    );
  }

  renderSlots () {
    const { board } = this.props;
    const slots = Object.keys(board).map(k => board[k]);

    return (
      <div className='row'>
        {slots.map((slot,idx) => (
          <div className='col-sm-6 col-lg-3' key={idx}>
            <Slot slot={slot} />
          </div>
        ))}
      </div>
    );
  }

  static propTypes = {
    list: React.PropTypes.object.isRequired,
    board: React.PropTypes.object.isRequired
  };
}


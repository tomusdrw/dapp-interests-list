import React from 'react';

import FlatButton from 'material-ui/FlatButton';

export default class RelatedLists extends React.Component {

  render () {
    return (
      <div className={'well'}>
        <h4>Related Lists</h4>
        {this.props.related.map(list => (
          <FlatButton
            key={list.name}
            onTouchTap={this.props.onChange.bind(this, list)}
            label={list.name}
            />
        ))}
      </div>
    );
  }

  static propTypes = {
    related: React.PropTypes.array.isRequired,
    onChange: React.PropTypes.func.isRequired
  };
}

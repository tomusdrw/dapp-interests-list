import React from 'react';

export default class Address extends React.Component {
  static propTypes = {
    address: React.PropTypes.string.isRequired
  };

  render () {
    const { address } = this.props;
    return (
      <span title={ address }>
        { this.shortAddress(address) }
      </span>
    );
  }

  shortAddress (address) {
    const len = address.length;
    return address.slice(2, 8) + '..' + address.slice(len - 7);
  }
}

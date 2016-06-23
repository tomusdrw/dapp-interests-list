import React from 'react';

export default class EthValue extends React.Component {
  static propTypes = {
    wei: React.PropTypes.object,
    eth: React.PropTypes.number
  };

  render () {
    const { wei, eth } = this.props;

    if (eth) {
      return (
        <span>
          <strong>{Number(eth)}</strong> <small>ETH</small>
        </span>
      );
    }
  
    const v = wei.div(1e18);
    return (
      <span>
        <strong>{v.toFormat(3)}</strong> <small>ETH</small>
      </span>
    );
  }
}

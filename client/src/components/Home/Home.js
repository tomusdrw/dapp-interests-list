import React from 'react';

import NewList from '../NewList';

import creatorAbi from './creator.abi';
import {CREATION_COST} from './creator.abi';
// TODO [ToDr] ?
const CREATOR_ADDRESS = '0x777861146e3369874e5240c4b783738f3133b896';

export default class Home extends React.Component {

  state = {
    isError: false,
    isLoading: true,
    isCreating: false,
    lists: [],
    currentList: '0x0',
  };

  componentWillMount() {
    this.contract = this.context.web3.eth.contract(creatorAbi).at(CREATOR_ADDRESS);
    const events = this.contract.ListCreated({
      parent: this.state.currentList
    }, {
      fromBlock: 0,
      toBlock: 'latest'
    });
    events.watch(this.updateLogs);
  }

  updateLogs = (err, log) => {
    const name = hex2a(log.args.name.substr(2));
    const address = log.args.target;

    this.setState({
      isError: err,
      isLoading: false,
      lists: this.state.lists.concat([{
        name, address
      }])
    });
  }

  createNewList = (parent, name) => {
    this.setState({
      isCreating: true
    });
    this.contract.createList(parent, name, {
      from: this.context.web3.defaultAccount,
      value: this.context.web3.toWei(CREATION_COST)
    }, (err, hash) => {
      if (err) {
        console.error('Error while creating list.', err);
      }
      this.setState({
        isCreating: false
      });
    });
  }

  componentWillUnmount() {
    this.contract.stopWatching();
  }

  render () {
    if (this.state.isLoading) {
      return (
        <h1>Loading...</h1>
      );
    }

    if (this.state.isError) {
      return (
        <h1>Error: {this.state.isError.toString()}</h1>
      );
    }

    return (
      <div className={'container'}>
        <br/>
        <NewList
          cost={CREATION_COST}
          onNewList={this.createNewList}
          isCreating={this.state.isCreating}
          />
        {/* <RelatedLists lists={this.state.related} /> */}
        <pre>{JSON.stringify(this.state.lists, null, 2)}</pre>
      </div>
    );
  }

  static contextTypes = {
    web3: React.PropTypes.object.isRequired
  };
}

function hex2a(hexx) {
  const hex = hexx.toString();//force conversion
  let str = '';
  for (let i = 0; i < hex.length; i += 2) {
    str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
  }
  return str;
}

import React from 'react';

import NewList from '../NewList';
import RelatedLists from '../RelatedLists';

import creatorAbi from './creator.abi';
import {CREATION_COST} from './creator.abi';
// TODO [ToDr] ?
const CREATOR_ADDRESS = '0x777861146e3369874e5240c4b783738f3133b896';

export default class Home extends React.Component {

  state = {
    isError: false,
    isLoading: true,
    isCreating: false,
    related: [],
    currentList: {
      name: '',
      address: CREATOR_ADDRESS
    },
    // TODO [ToDr] Use that to go back
    previousLists: []
  };

  componentWillMount() {
    this.contract = this.context.web3.eth.contract(creatorAbi).at(CREATOR_ADDRESS);
    this.events = {
      stopWatching: () => {}
    };
    this.restartWatching();
  }

  restartWatching () {
    this.events.stopWatching();
    this.events = this.contract.ListCreated({
      parent: this.state.currentList.name
    }, {
      fromBlock: 0,
      toBlock: 'latest'
    });
    this.setState({
      related: []
    });
    this.events.watch(this.updateLogs);
  }

  updateLogs = (err, log) => {
    const name = hex2a(log.args.name.substr(2));
    const address = log.args.target;

    this.setState({
      isError: err,
      isLoading: false,
      related: this.state.related.concat([{
        name, address
      }])
    });
  }

  selectList = (list) => {
    this.setState({
      previousLists: this.state.previousLists.concat([this.state.currentList]),
      currentList: list
    });
    this.restartWatching();
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
    this.events.stopWatching();
  }

  renderBoard () {
    const {name} = this.state.currentList;
    // Main contract doesn't have a board
    if (!name) {
      return;
    }

    return (
      <h1>List {name}</h1>   
    );
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
        {this.renderBoard()}
        <RelatedLists
          related={this.state.related}
          onChange={this.selectList}
          />
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
    const v = parseInt(hex.substr(i, 2), 16);
    if (v !== 0) {
      str += String.fromCharCode(v);
    }
  }
  return str;
}

import React from 'react';

import NewList from '../NewList';

import creatorAbi from './creator.abi';
import {CREATION_COST} from './creator.abi';
// TODO [ToDr] ?
const CREATOR_ADDRESS = '0xd8a95cd5c89d059b991150cb2a699823c2cda0ce';

export default class Home extends React.Component {

  state = {
    isError: false,
    isLoading: true,
    isCreating: false,
    logs: [],
    currentList: "",
  };

  componentWillMount() {
    this.contract = this.context.web3.eth.contract(creatorAbi).at(CREATOR_ADDRESS);
    const events = this.contract.ListCreated({}, {
      fromBlock: 0,
      toBlock: 'latest'
    });
    events.get(this.updateLogs);
    events.watch(this.updateLogs);
  }

  updateLogs = (err, logs) => {
    this.setState({
      isError: err,
      isLoading: false,
      logs: this.state.logs.concat(logs)
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
        <pre>{JSON.stringify(this.state.logs, null, 2)}</pre>
      </div>
    );
  }

  static contextTypes = {
    web3: React.PropTypes.object.isRequired
  };
}

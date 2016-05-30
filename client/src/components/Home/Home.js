import React from 'react';

import NewList from '../NewList';
import RelatedLists from '../RelatedLists';
import Board from '../Board';

import listAbi from './list.abi';
import creatorAbi from './creator.abi';
import {CREATION_COST} from './creator.abi';
// TODO [ToDr] ?
const CREATOR_ADDRESS = '0x07e8bd97fdd7a7bd12bce8892f914cdcf4f68e89';

export default class Home extends React.Component {

  state = {
    isError: false,
    isLoading: true,
    isCreating: false,
    related: [],
    board: {},
    currentList: {
      name: '',
      address: CREATOR_ADDRESS
    },
    // TODO [ToDr] Use that to go back
    previousLists: []
  };

  componentWillMount() {
    this.contract = this.context.web3.eth.contract(creatorAbi).at(CREATOR_ADDRESS);
    this.related = {
      stopWatching: () => {}
    };
    this.board = {
      stopWatching: () => {}
    };
    this.restartRelatedWatching(this.state.currentList);
  }

  restartRelatedWatching (currentList) {
    this.setState({
      related: [],
    });
    this.related.stopWatching();
    this.related = this.contract.ListCreated({
      parent: currentList.name
    }, {
      fromBlock: 0,
      toBlock: 'latest'
    });
    this.related.get(this.updateLogs);
    this.related.watch(this.updateLog);
  }

  restartBoardWatching (currentList) {
    this.setState({
      board: {}
    });
    this.board.stopWatching();

    if (!currentList.name) {
      return;
    }
    this.boardContract = this.context.web3.eth.contract(listAbi).at(currentList.address);
    this.board = this.boardContract.Changed({}, {
      from: 'latest',
      to: 'latest'
    });
    this.board.watch(this.refetchBoard);
  }

  refetchBoard = () => {
    this.setState({
      board: {}
    });
    this.boardContract.getNoOfSlots((err, noOfSlots) => {
      Array(noOfSlots).join('m').split('m').map(slotNo => {
        this.boardContract.getMessage(slotNo, (err, message) => {
          // clone board
          const board = Object.assign({}, this.state.board);
          board[slotNo] = message;
          console.log(message);
          this.setState({
            board: board
          });
        });
      });
    });
  }

  updateLogs = (err, logs) => {
    this.setState({
      isLoading: false,
      isError: err
    });
    logs.map((log) => {
      this.updateLog(err, log)
    });
  }

  updateLog = (err, log) => {
    const name = hex2a(log.args.name.substr(2));
    const address = log.args.target;

    const names = this.state.related.map(l => l.name);
    if (names.indexOf(name) !== -1) {
      // We already have this name,
      // web3 returns the same log multiple times.
      this.setState({
        isLoading: false,
        isError: err
      });
      return;
    }

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
    this.restartRelatedWatching(list);
    this.restartBoardWatching(list);
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
    this.related.stopWatching();
    this.board.stopWatching();
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
        <Board
          list={this.state.currentList}
          board={this.state.board}
          />
        <RelatedLists
          parent={this.state.currentList.name}
          related={this.state.related}
          onChange={this.selectList}
          />
        <NewList
          defaultParent={this.state.currentList.name}
          cost={CREATION_COST}
          onNewList={this.createNewList}
          isCreating={this.state.isCreating}
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

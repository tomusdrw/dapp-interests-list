import React from 'react';

import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

export default class NewList extends React.Component {

  state = {
    parent: '',
    name: ''
  };

  createNew = (ev) => {
    this.props.onNewList(this.state.parent, this.state.name);

    this.setState({
      parent: '',
      name: ''
    });
  }

  updateParent = (ev) => {
    this.setState({
      parent: ev.target.value
    });
  }

  updateName = (ev) => {
    this.setState({
      name: ev.target.value
    });
  }

  renderButton () {
    if (this.props.isCreating) {
      return (
        <RaisedButton
          disabled
          label='Creating...'
        />
      );
    }

    return (
      <RaisedButton
        disabled={!this.state.name.length}
        onTouchTap={this.createNew}
        label='Create new list'
        />
    );
  }

  render () {
    return (
      <div className={'well'}>
        <h3>Create new list ({this.props.cost} ETH)</h3>
        <form onSubmit={this.createNew}>
          <TextField
            hintText='Name of your list.'
            floatingLabelText='Name'
            value={this.state.name}
            onChange={this.updateName}
            />
          <TextField
            hintText='Leave empty for top-level list.'
            floatingLabelText='Parent Name'
            value={this.state.parent}
            onChange={this.updateParent}
            /><br/>
          {this.renderButton()}
        </form>
      </div>
    );
  }

  static propTypes = {
    cost: React.PropTypes.number.isRequired,
    isCreating: React.PropTypes.bool,
    onNewList: React.PropTypes.func.isRequired
  };
}

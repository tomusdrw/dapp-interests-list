import React from 'react';

export default class Home extends React.Component {

  state = {
    isLoading: true,
    isError: false,
    apps: []
  };

  render () {
    return (
      <span>Home!</span>
    );
  }
}

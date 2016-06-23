import React from 'react';

export default class Slot extends React.Component {
  static propTypes = {
    slot: React.PropTypes.array
  };

  render () {
    const { slot } = this.props;

    if (!slot) {
      return this.renderSlotFree();
    }

    const submitter = slot[0];
    const beneficiary = slot[1];
    const title = slot[2];
    const message = slot[3];
    const deposit = slot[4];
    const deadline = slot[5];
    const donations = slot[6];

    return (
      <div className='thumbnail'>
        <div className='caption'>
          <div className='pull-right text-right'>
            <span
              className='label label-success'
              title='Total amount of Ether donated.'
              >
              {donations.toFormat(3)} ETH Donated
            </span>
            <br />
            <span
              className='label label-danger'
              title='Ethere value deposited by a sender.'
              >
              {deposit.toFormat(3)} ETH Payed
            </span>
          </div>
          <h3>{title}</h3>
          <p>{message}</p>
          <p>Posted by {submitter}</p>
          <p className='text-center'>
            <a href='#' className='btn btn-success btn-link'>
              Donate (1 ETH) to {beneficiary}
            </a>
          </p>
        </div>
      </div>
    );
  }

  renderSlotFree () {
    return (
      <div className='thumbnail'>
        'Free!'
      </div>
    );
  }
}


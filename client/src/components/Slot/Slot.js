import React from 'react';

import EthValue from '../EthValue';
import Address from '../Address';
import Date from '../Date';

import styles from './styles.css';

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
      <div className={`thumbnail ${styles.slot}`}>
        <div className={`caption ${styles.content}`}>
          <div>
            <span
              className='label label-success pull-right'
              title='Total amount of Ether donated.'
              >
              <EthValue wei={donations} /> donated
            </span>
            <span
              className='label label-danger pull-left'
              title='Ethere value deposited by a sender.'
              >
              <EthValue wei={deposit} /> payed
            </span>
          </div>
          <h3>{title}</h3>
          <p>{message}</p>
          <span className={styles.separator}></span>
          <p className='text-center'>
            <a href='#' className='btn btn-success'>
              Donate <EthValue eth={1} />
              <br />
              <Address address={beneficiary} />
            </a>
          </p>
          <div className={styles.footer}>
            <span>Author: <Address address={submitter} /></span>
            <span className={styles.separator} />
            <span>Date: <Date timestamp={Number(deadline)} /></span>
          </div>
        </div>
      </div>
    );
  }

  renderSlotFree () {
    return (
      <div className={`thumbnail ${styles.slot} ${styles.emptySlot}`}>
        <div className={`caption ${styles.content}`}>
          <p>This slot is empty.</p>
          <button className='btn btn-link btn-primary'>
            Post Message
          </button>
        </div>
      </div>
    );
  }
}


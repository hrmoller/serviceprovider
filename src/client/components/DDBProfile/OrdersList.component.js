'use strict';

/**
 * @file
 * DDBProfile component displays the user attributes and allows editing.
 */

import React, {PropTypes} from 'react';
// import Reflux from 'reflux';
import {curry, sortByAll} from 'lodash';

class OrdersList extends React.Component {


  constructor() {
    super();
  }

  render() {

    const deleteOrder = this.props.onDelete ? curry(this.props.onDelete, 3) : function() {};

    let orderListContent = (<p>ingen reserveringer</p>);
    if (this.props.orders) {

      let sortedOrders = sortByAll(this.props.orders, (o) => {
        return o.status !== 'Available for pickup';
      }, 'title');

      orderListContent = sortedOrders.map(function(order) {
        const ready = (order.status === 'Available for pickup');

        let actionField = <button className='tiny' onClick={deleteOrder(order.orderId, order.orderType)}>slet</button>;
        if (order.markedForDeletion) {
          actionField = <button className='tiny' onClick={deleteOrder(order.orderId, order.orderType)}>marked</button>;

          if (order.isDeleteConfirmed && !order.isDeleteSuccesful) {
            actionField = <button className='tiny' onClick={deleteOrder(order.orderId, order.orderType)}>kunne ikke slette reservering</button>;
          }
          else if (order.isDeleteConfirmed && order.isDeleteSuccesful) {
            actionField = <button className='tiny' onClick={deleteOrder(order.orderId, order.orderType)}>reservering slettet</button>;
          }
        }

        const date = new Date(order.pickUpExpiryDate);
        const pickupDate = (order.pickUpExpiryDate ? 'Hentes senest ' + date.getDate() + '/' + (date.getMonth() + 1) + '-' + date.getFullYear() : '');
        let pickupClass = 'small-9 medium-10 large-10 column';
        if (ready) {
          pickupClass += ' ready';
        }

        const queue = (order.queue !== null) ? 'Kø: ' + order.queue : '';

        return (
          <li className='row' key={order.orderId}>
            <span className='small-10 medium-11 large-12 column'>{order.title}</span>
            <span className={pickupClass}>{ready ? 'Klar til afhentning på ' + order.pickUpAgency : queue}</span>
            <span className='small-5 medium-3 large-2 column'>{ready ? pickupDate : actionField}</span>
          </li>
        );
      });
    }

    const ordersList = (<ul>
      {orderListContent}
    </ul>);

    const loadingWheel = (<p>Loading...</p>);

    const content = (
        <div className='row'>
          <h2>Reserveringer</h2>
          {(this.props.orders === null) ? loadingWheel : ordersList}
        </div>
    );

    return content;
  }

}

OrdersList.propTypes = {
  onDelete: PropTypes.func,
  orders: PropTypes.array
};

OrdersList.displayName = 'OrdersList.component';

export default OrdersList;

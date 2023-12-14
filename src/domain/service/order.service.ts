import { randomUUID } from 'node:crypto'

import { Customer } from '../entity/customer'
import { Order } from '../entity/order'
import { OrderItem } from '../entity/order-item'

export class OrderService {
  static getTotal(orders: Order[]) {
    return orders.reduce((total, item) => total + item.total(), 0)
  }

  static placeOrder(customer: Customer, items: OrderItem[]) {
    if (items.length === 0) {
      throw new Error('Order must have at least one item')
    }

    const order = new Order(randomUUID(), customer.id, items)
    customer.addRewardPoints(order.total() / 2)

    return order
  }
}

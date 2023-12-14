import { Customer } from '../entity/customer'
import { Order } from '../entity/order'
import { OrderItem } from '../entity/order-item'
import { OrderService } from './order.service'

describe('Order service unit tests', () => {
  it('should place an order', () => {
    const customer = new Customer('c1', 'Customer 1')
    const item1 = new OrderItem('1', 'Item 1', 100, 'p1', 1)
    const item2 = new OrderItem('1', 'Item 2', 200, 'p1', 2)

    const order = OrderService.placeOrder(customer, [item1, item2])

    expect(customer.rewardPoints).toBe(250)
    expect(order.total()).toBe(500)
  })

  it('should get total of all orders', () => {
    const item1 = new OrderItem('1', 'Item 1', 100, 'p1', 1)
    const item2 = new OrderItem('1', 'Item 2', 200, 'p1', 2)

    const order1 = new Order('1', 'c1', [item1])
    const order2 = new Order('2', 'c1', [item2])

    const total = OrderService.getTotal([order1, order2])

    expect(total).toBe(500)
  })
})

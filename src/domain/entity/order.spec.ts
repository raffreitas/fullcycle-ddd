import { Order } from './order'
import { OrderItem } from './order-item'

describe('Order unit tests', () => {
  it('should throw error when id is empty', () => {
    expect(() => {
      const order = new Order('', '123', [])
    }).toThrow('Id is required')
  })

  it('should throw error when customerId is empty', () => {
    expect(() => {
      const order = new Order('123', '', [])
    }).toThrow('CustomerId is required')
  })

  it('should throw error when items is empty', () => {
    expect(() => {
      const order = new Order('123', '123', [])
    }).toThrow('Item qtd must be greater than 0')
  })

  it('should calculate total', () => {
    const item1 = new OrderItem('1', 'Item 1', 10, 'p1', 2)
    const item2 = new OrderItem('2', 'Item 2', 12, 'p2', 2)
    const order = new Order('1', '123', [item1, item2])

    expect(order.total()).toBe(44)
  })

  it('should throw error if the item quantity is less or equal than 0', () => {
    expect(() => {
      const item1 = new OrderItem('1', 'Item 1', 10, 'p1', 0)
      const order = new Order('1', '123', [item1])
    }).toThrow('Item qtd must be greater than 0')
  })
})

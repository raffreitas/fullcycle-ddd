import { Sequelize } from 'sequelize-typescript'
import { CustomerModel } from '../db/sequelize/model/customer.model'
import { OrderModel } from '../db/sequelize/model/order.model'
import { OrderItemModel } from '../db/sequelize/model/order-items.model'
import { ProductModel } from '../db/sequelize/model/product.model'
import { CustomerRepository } from './customer.repository'
import { Customer } from '../../domain/entity/customer'
import { Address } from '../../domain/entity/value-objects/address'
import { ProductRepository } from './product.repository'
import { Product } from '../../domain/entity/product'
import { OrderItem } from '../../domain/entity/order-item'
import { Order } from '../../domain/entity/order'
import { OrderRepository } from './order.repository'

let sequelize: Sequelize

describe('Order Repository tests', () => {
  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
      sync: { force: true },
    })
    sequelize.addModels([
      CustomerModel,
      OrderModel,
      OrderItemModel,
      ProductModel,
    ])
    await sequelize.sync()
  })

  afterEach(async () => {
    await sequelize.close()
  })

  it('should create a new order', async () => {
    const customerRepository = new CustomerRepository()
    const customer = new Customer('1', 'Customer 1')
    const address = new Address('Street 1', 123, 'Zip 1', 'City 1')
    customer.changeAddress(address)
    await customerRepository.create(customer)

    const productRepository = new ProductRepository()
    const product = new Product('1', 'Product 1', 10)
    await productRepository.create(product)

    const orderItem = new OrderItem(
      '1',
      product.name,
      product.price,
      product.id,
      2,
    )

    const order = new Order('1', customer.id, [orderItem])
    const orderRepository = new OrderRepository()
    await orderRepository.create(order)

    const orderModel = await OrderModel.findOne({
      where: { id: order.id },
      include: ['items'],
    })

    expect(orderModel?.toJSON()).toStrictEqual({
      id: order.id,
      customerId: customer.id,
      total: order.total(),
      items: [
        {
          id: orderItem.id,
          orderId: order.id,
          productId: product.id,
          quantity: orderItem.quantity,
          name: product.name,
          price: product.price,
        },
      ],
    })
  })

  it('should update an order', async () => {
    const customerRepository = new CustomerRepository()
    const customer = new Customer('1', 'Customer 1')
    const address = new Address('Street 1', 123, 'Zip 1', 'City 1')
    customer.changeAddress(address)
    await customerRepository.create(customer)

    const productRepository = new ProductRepository()
    const product1 = new Product('1', 'Product 1', 10)
    const product2 = new Product('2', 'Product 2', 20)
    await productRepository.create(product1)
    await productRepository.create(product2)

    const orderItem1 = new OrderItem(
      '1',
      product1.name,
      product1.price,
      product1.id,
      2,
    )
    const orderItem2 = new OrderItem(
      '2',
      product2.name,
      product2.price,
      product2.id,
      2,
    )

    const order = new Order('1', customer.id, [orderItem1, orderItem2])
    const orderRepository = new OrderRepository()
    await orderRepository.create(order)

    order.removeItem(product1.id)

    await orderRepository.update(order)

    const orderModel = await OrderModel.findOne({
      where: { id: order.id },
      include: ['items'],
    })

    expect(orderModel?.toJSON()).toStrictEqual({
      id: order.id,
      customerId: customer.id,
      total: order.total(),
      items: [
        {
          id: orderItem2.id,
          orderId: order.id,
          productId: product2.id,
          quantity: orderItem2.quantity,
          name: product2.name,
          price: product2.price,
        },
      ],
    })
  })

  it('should find an order', async () => {
    const customerRepository = new CustomerRepository()
    const customer = new Customer('1', 'Customer 1')
    const address = new Address('Street 1', 123, 'Zip 1', 'City 1')
    customer.changeAddress(address)
    await customerRepository.create(customer)

    const productRepository = new ProductRepository()
    const product = new Product('1', 'Product 1', 10)
    await productRepository.create(product)

    const orderItem = new OrderItem(
      '1',
      product.name,
      product.price,
      product.id,
      2,
    )

    const order = new Order('1', customer.id, [orderItem])
    const orderRepository = new OrderRepository()
    await orderRepository.create(order)

    const foundOrder = await orderRepository.find('1')

    expect(foundOrder).toStrictEqual(order)
  })

  it('should find all orders', async () => {
    const customerRepository = new CustomerRepository()
    const customer = new Customer('1', 'Customer 1')
    const address = new Address('Street 1', 123, 'Zip 1', 'City 1')
    customer.changeAddress(address)
    await customerRepository.create(customer)

    const productRepository = new ProductRepository()
    const product = new Product('1', 'Product 1', 10)
    await productRepository.create(product)

    const orderItem1 = new OrderItem(
      '1',
      product.name,
      product.price,
      product.id,
      2,
    )
    const orderItem2 = new OrderItem(
      '2',
      product.name,
      product.price,
      product.id,
      2,
    )

    const order1 = new Order('1', customer.id, [orderItem1])
    const order2 = new Order('2', customer.id, [orderItem2])

    const orderRepository = new OrderRepository()

    await orderRepository.create(order1)
    await orderRepository.create(order2)

    const foundOrders = await orderRepository.findAll()

    expect(foundOrders).toStrictEqual([order1, order2])
  })
})

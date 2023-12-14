import { Sequelize } from 'sequelize-typescript'
import { CustomerModel } from '../db/sequelize/model/customer.model'
import { CustomerRepository } from './customer.repository'
import { Customer } from '../../domain/entity/customer'
import { Address } from '../../domain/entity/value-objects/address'

describe('Customer Repository tests', () => {
  let sequelize: Sequelize
  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
      sync: { force: true },
    })
    sequelize.addModels([CustomerModel])
    await sequelize.sync()
  })

  afterEach(async () => {
    await sequelize.close()
  })

  it('should create a customer', async () => {
    const customerRepository = new CustomerRepository()
    const customer = new Customer('123', 'Customer 1')
    const address = new Address('Street 1', 1, 'Zip code 1', 'City 1')
    customer.changeAddress(address)
    await customerRepository.create(customer)

    const customerModel = await CustomerModel.findOne({
      where: { id: customer.id },
    })

    expect(customerModel?.toJSON()).toStrictEqual({
      id: customer.id,
      name: customer.name,
      street: customer.address.street,
      number: customer.address.number,
      zipCode: customer.address.zip,
      city: customer.address.city,
      active: customer.isActive(),
      rewardPoints: customer.rewardPoints,
    })
  })

  it('should update a customer', async () => {
    const customerRepository = new CustomerRepository()
    const customer = new Customer('123', 'Customer 1')
    const address = new Address('Street 1', 1, 'Zip code 1', 'City 1')
    customer.changeAddress(address)
    await customerRepository.create(customer)

    customer.changeName('Customer 2')
    await customerRepository.update(customer)

    const customerModel = await CustomerModel.findOne({
      where: { id: customer.id },
    })

    expect(customerModel?.toJSON()).toStrictEqual({
      id: customer.id,
      name: customer.name,
      street: customer.address.street,
      number: customer.address.number,
      zipCode: customer.address.zip,
      city: customer.address.city,
      active: customer.isActive(),
      rewardPoints: customer.rewardPoints,
    })
  })

  it('should find a customer', async () => {
    const customerRepository = new CustomerRepository()
    const customer = new Customer('123', 'Customer 1')
    const address = new Address('Street 1', 1, 'Zip code 1', 'City 1')
    customer.changeAddress(address)
    await customerRepository.create(customer)

    const customerResult = await customerRepository.find(customer.id)

    expect(customerResult).toStrictEqual(customer)
  })

  it('should throw and error when customer is not found', async () => {
    const customerRepository = new CustomerRepository()

    expect(async () => {
      await customerRepository.find('ABCDE')
    }).rejects.toThrow('Customer not found')
  })

  it('should find all customers', async () => {
    const customerRepository = new CustomerRepository()
    const customer1 = new Customer('1', 'Customer 1')
    const customer2 = new Customer('2', 'Customer 2')
    const address1 = new Address('Street 1', 1, 'Zip code 1', 'City 1')
    const address2 = new Address('Street 2', 2, 'Zip code 2', 'City 2')
    customer1.changeAddress(address1)
    customer2.changeAddress(address2)
    await customerRepository.create(customer1)
    await customerRepository.create(customer2)

    const customers = await customerRepository.findAll()

    expect(customers).toHaveLength(2)
    expect(customers).toStrictEqual([customer1, customer2])
  })
})

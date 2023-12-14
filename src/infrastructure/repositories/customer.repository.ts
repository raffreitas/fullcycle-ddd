import { Customer } from '../../domain/entity/customer'
import { Address } from '../../domain/entity/value-objects/address'
import { CustomerRepositoryInterface } from '../../domain/repository/customer.repository.interface'
import { CustomerModel } from '../db/sequelize/model/customer.model'

export class CustomerRepository implements CustomerRepositoryInterface {
  async create(entity: Customer): Promise<void> {
    await CustomerModel.create({
      id: entity.id,
      name: entity.name,
      street: entity.address.street,
      number: entity.address.number,
      zipCode: entity.address.zip,
      city: entity.address.city,
      active: entity.isActive(),
      rewardPoints: entity.rewardPoints,
    })
  }

  async update(entity: Customer): Promise<void> {
    await CustomerModel.update(
      {
        name: entity.name,
        street: entity.address.street,
        number: entity.address.number,
        zipCode: entity.address.zip,
        city: entity.address.city,
        active: entity.isActive(),
        rewardPoints: entity.rewardPoints,
      },
      {
        where: { id: entity.id },
      },
    )
  }

  async find(id: string): Promise<Customer> {
    let customerModel: CustomerModel
    try {
      customerModel = await CustomerModel.findOne({
        where: { id },
        rejectOnEmpty: true,
      })

      const customer = new Customer(customerModel.id, customerModel.name)
      const address = new Address(
        customerModel.street,
        customerModel.number,
        customerModel.zipCode,
        customerModel.city,
      )

      customer.changeAddress(address)

      return customer
    } catch (error) {
      throw new Error('Customer not found')
    }
  }

  async findAll(): Promise<Customer[]> {
    const customers = await CustomerModel.findAll()

    return customers.map((customerModels) => {
      const customer = new Customer(customerModels.id, customerModels.name)
      const address = new Address(
        customerModels.street,
        customerModels.number,
        customerModels.zipCode,
        customerModels.city,
      )

      customer.changeAddress(address)
      customer.addRewardPoints(customerModels.rewardPoints)

      if (customerModels.active) {
        customer.activate()
      }

      return customer
    })
  }
}

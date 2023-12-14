import { Customer } from './customer'
import { Address } from './value-objects/address'

describe('Customer unit tests', () => {
  it('should throw error when id is empty', () => {
    expect(() => new Customer('', 'John Doe')).toThrow('ID is required')
  })

  it('should throw error when name is empty', () => {
    expect(() => new Customer('123', '')).toThrow('Name is required')
  })

  it('should change name', () => {
    // Arrange
    const customer = new Customer('123', 'John Doe')
    // Act
    customer.changeName('Jane Doe')
    // Assert
    expect(customer.name).toBe('Jane Doe')
  })

  it('should activate customer', () => {
    const customer = new Customer('123', 'John Doe')
    const address = new Address('Street1', 123, '11330-250', 'São Paulo')
    customer.changeAddress(address)

    customer.activate()

    expect(customer.isActive()).toBe(true)
  })

  it('should throw error when activating customer without address', () => {
    expect(() => {
      const customer = new Customer('123', 'John Doe')
      customer.activate()
    }).toThrow('Address is mandatory to activate a customer')
  })

  it('should deactivate customer', () => {
    const customer = new Customer('123', 'John Doe')
    customer.deactivate()
    expect(customer.isActive()).toBe(false)
  })

  it('should add reward points', () => {
    const customer = new Customer('123', 'John Doe')
    expect(customer.rewardPoints).toBe(0)

    customer.addRewardPoints(100)
    expect(customer.rewardPoints).toBe(100)

    customer.addRewardPoints(100)
    expect(customer.rewardPoints).toBe(200)
  })
})

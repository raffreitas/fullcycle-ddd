import { Product } from './product'

describe('Product unit tests', () => {
  it('should throw error when id is empty', () => {
    expect(() => {
      const product = new Product('', 'Product 1', 100)
    }).toThrow('Id is required')
  })

  it('should throw error when name is empty', () => {
    expect(() => {
      const product = new Product('123', '', 100)
    }).toThrow('Name is required')
  })

  it('should throw error when price is less then zero', () => {
    expect(() => {
      const product = new Product('123', 'Product 1', -1)
    }).toThrow('Price must be greater then zero')
  })

  it('should change name', () => {
    const product = new Product('123', 'Product 1', 100)
    product.changeName('Product 2')
    expect(product.name).toEqual('Product 2')
  })

  it('should change price', () => {
    const product = new Product('123', 'Product 1', 100)
    product.changePrice(200)
    expect(product.price).toEqual(200)
  })
})

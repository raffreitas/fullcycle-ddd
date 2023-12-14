import { OrderItem } from './order-item'

export class Order {
  private _id = ''
  private _customerId = ''
  private _items: OrderItem[] = []

  constructor(id: string, customerId: string, items: OrderItem[]) {
    this._id = id
    this._customerId = customerId
    this._items = items

    this.validate()
  }

  get id() {
    return this._id
  }

  get customerId() {
    return this._customerId
  }

  get items() {
    return this._items
  }

  validate() {
    if (this._id.length === 0) {
      throw new Error('Id is required')
    }
    if (this._customerId.length === 0) {
      throw new Error('CustomerId is required')
    }
    if (this._items.length === 0) {
      throw new Error('Item qtd must be greater than 0')
    }
    if (this._items.some((item) => item.quantity <= 0)) {
      throw new Error('Item qtd must be greater than 0')
    }
  }

  total() {
    return this._items.reduce((sum, item) => sum + item.orderItemTotal(), 0)
  }

  removeItem(productId: string) {
    this._items = this._items.filter((item) => item.productId !== productId)
  }
}

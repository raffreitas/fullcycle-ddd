export class OrderItem {
  private _id = ''
  private _productId = ''
  private _name = ''
  private _price = 0
  private _quantity = 0

  constructor(
    id: string,
    name: string,
    price: number,
    productId: string,
    quantity: number,
  ) {
    this._id = id
    this._name = name
    this._price = price
    this._productId = productId
    this._quantity = quantity

    this.validate()
  }

  get id() {
    return this._id
  }

  get name() {
    return this._name
  }

  get price() {
    return this._price
  }

  get quantity() {
    return this._quantity
  }

  get productId() {
    return this._productId
  }

  orderItemTotal() {
    return this._price * this._quantity
  }

  validate() {
    if (this._quantity <= 0) {
      throw new Error('Item qtd must be greater than 0')
    }
  }
}

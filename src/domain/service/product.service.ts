import { Product } from '../entity/product'

export class ProductService {
  static increasePrices(products: Product[], percentage: number) {
    products.forEach((product) => {
      product.changePrice(product.price * (percentage / 100) + product.price)
    })

    return products
  }
}

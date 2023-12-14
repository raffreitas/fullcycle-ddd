import {
  Column,
  PrimaryKey,
  Table,
  Model,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript'
import { ProductModel } from './product.model'
import { OrderModel } from './order.model'

@Table({
  tableName: 'order_items',
  timestamps: false,
})
export class OrderItemModel extends Model {
  @PrimaryKey
  @Column
  declare id: string

  @ForeignKey(() => ProductModel)
  @Column({ field: 'product_id' })
  declare productId: string

  @BelongsTo(() => ProductModel)
  declare product: ProductModel

  @ForeignKey(() => OrderModel)
  @Column({ field: 'order_id' })
  declare orderId: string

  // @BelongsTo(() => OrderModel, 'order_id')
  // declare order: OrderModel

  @Column({ allowNull: false })
  declare quantity: number

  @Column({ allowNull: false })
  declare name: string

  @Column({ allowNull: false })
  declare price: number
}

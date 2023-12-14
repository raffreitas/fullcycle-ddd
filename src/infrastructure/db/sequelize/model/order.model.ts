import {
  Column,
  PrimaryKey,
  Table,
  Model,
  ForeignKey,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript'
import { CustomerModel } from './customer.model'
import { OrderItemModel } from './order-items.model'

@Table({
  tableName: 'orders',
  timestamps: false,
})
export class OrderModel extends Model {
  @PrimaryKey
  @Column
  declare id: string

  @ForeignKey(() => CustomerModel)
  @Column({ field: 'customer_id' })
  declare customerId: string

  @BelongsTo(() => CustomerModel)
  declare customer: CustomerModel

  @HasMany(() => OrderItemModel)
  declare items: OrderItemModel[]

  @Column({ allowNull: false })
  declare total: number
}

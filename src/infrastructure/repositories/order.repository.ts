import { Order } from '../../domain/entity/order'
import { OrderItem } from '../../domain/entity/order-item'
import { OrderRepositoryInterface } from '../../domain/repository/order.repository.interface'
import { OrderItemModel } from '../db/sequelize/model/order-items.model'
import { OrderModel } from '../db/sequelize/model/order.model'

export class OrderRepository implements OrderRepositoryInterface {
  async create(entity: Order): Promise<void> {
    await OrderModel.create(
      {
        id: entity.id,
        customerId: entity.customerId,
        total: entity.total(),
        items: entity.items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          productId: item.productId,
          quantity: item.quantity,
        })),
      },
      {
        include: [{ model: OrderItemModel }],
      },
    )
  }

  async update(entity: Order): Promise<void> {
    await OrderModel.update(
      {
        customerId: entity.customerId,
        total: entity.total(),
        items: entity.items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          productId: item.productId,
          quantity: item.quantity,
        })),
      },
      {
        where: {
          id: entity.id,
        },
      },
    )

    await OrderItemModel.destroy({
      where: {
        orderId: entity.id,
      },
    })

    await Promise.all(
      entity.items.map(
        async (item) =>
          await OrderItemModel.create({
            id: item.id,
            name: item.name,
            price: item.price,
            productId: item.productId,
            quantity: item.quantity,
            orderId: entity.id,
          }),
      ),
    )
  }

  async find(id: string): Promise<Order> {
    let orderModel: OrderModel
    try {
      orderModel = await OrderModel.findOne({
        where: { id },
        rejectOnEmpty: true,
        include: [{ model: OrderItemModel }],
      })

      return new Order(
        orderModel.id,
        orderModel.customerId,
        orderModel.items.map(
          (item) =>
            new OrderItem(
              item.id,
              item.name,
              item.price,
              item.productId,
              item.quantity,
            ),
        ),
      )
    } catch (error) {
      throw new Error('Order not found')
    }
  }

  async findAll(): Promise<Order[]> {
    const orders = await OrderModel.findAll({
      include: [{ model: OrderItemModel }],
    })

    return orders.map(
      (order) =>
        new Order(
          order.id,
          order.customerId,
          order.items.map(
            (item) =>
              new OrderItem(
                item.id,
                item.name,
                item.price,
                item.productId,
                item.quantity,
              ),
          ),
        ),
    )
  }
}

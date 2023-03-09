import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonService } from 'src/common/common.service';
import { actionsConnstants } from 'src/constants';
import { ProductsService } from 'src/products/products.service';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import {
  AddOrderDto,
  CreateComandaDto,
  QueryComandaDto,
  QueryOrderDto,
  UpdateComandaDto,
} from './dto';
import { Comanda, Order } from './entities';
import { OrderProduct } from './entities/order-products.entity';

@Injectable()
export class ComandasService {
  private readonly logger = new Logger(ComandasService.name);

  constructor(
    @InjectRepository(Comanda)
    private readonly comandaRepository: Repository<Comanda>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderProduct)
    private readonly orderProductRepository: Repository<OrderProduct>,
    private readonly commonService: CommonService,
    private readonly productsService: ProductsService,
    @Inject(REQUEST) private readonly request,
  ) {}

  getMeesageAudit(comanda) {
    return {
      message: `Comanda => ID: ${comanda.id}, mesa: ${comanda.mesa}`,
    };
  }

  async getProducts(products) {
    const array = [];
    for (let i = 0, t = products.length; i < t; i++) {
      const { productId, note } = products[i];
      const product = await this.productsService.findOne(productId);
      array.push({
        product,
        note,
      });
    }
    return array;
  }

  async createOrders({ bebida, comida, user, comanda }) {
    const createOrderProduct = async (array, bebidaOrComida, type) => {
      for (let i = 0, t = bebidaOrComida.length; i < t; i++) {
        const orderCreate = bebidaOrComida[i];
        const createOrderProduct = await this.orderProductRepository.create({
          ...orderCreate,
          user,
          comanda,
          type,
        });
        const orderProduct = await this.orderProductRepository.save(
          createOrderProduct,
        );
        array.push(orderProduct);
      }
      return array;
    };

    let array = [];

    array = await createOrderProduct(array, bebida, 'bebida');
    array = await createOrderProduct(array, comida, 'comida');

    const create = await this.orderRepository.create({
      comanda,
      products: array,
      user,
    });

    const order = await this.orderRepository.save(create);

    return order;
  }

  async create(createComandaDto: CreateComandaDto) {
    const user = this.request.user as User;
    const bebida = await this.getProducts(createComandaDto.bebida);
    const comida = await this.getProducts(createComandaDto.comida);
    const products = [...bebida, ...comida].map((row) => ({ ...row.product }));

    try {
      const comandaCreate = await this.comandaRepository.create({
        mesa: createComandaDto.mesa,
        user,
        products,
      });

      const comanda = await this.comandaRepository.save(comandaCreate);

      const order = await this.createOrders({
        bebida,
        comida,
        user,
        comanda: comandaCreate,
      });

      await this.comandaRepository.save({ ...comanda, orders: [order] });

      await this.commonService.saveAudit(
        actionsConnstants.CREATE,
        this.getMeesageAudit(comanda),
      );
      return comanda;
    } catch (error) {
      this.commonService.handleExceptions({
        ref: 'create',
        error,
        logger: this.logger,
      });
    }
  }

  async addOrder(addOrderDto: AddOrderDto) {
    const user = this.request.user as User;
    const bebida = await this.getProducts(addOrderDto.bebida);
    const comida = await this.getProducts(addOrderDto.comida);
    const products = [...bebida, ...comida].map((row) => ({ ...row.product }));
    const comanda = await this.findOne(addOrderDto.comandaId);

    try {
      const order = await this.createOrders({
        bebida,
        comida,
        user,
        comanda,
      });

      await this.comandaRepository.save({
        ...comanda,
        orders: [...comanda.orders, order],
        products: [...comanda.products, ...products],
      });

      await this.commonService.saveAudit(actionsConnstants.CREATE, {
        message: `Orden => ID: ${order.id}, mesa: ${comanda.mesa}, comanda: ${comanda.id}`,
      });
      return order;
    } catch (error) {
      this.commonService.handleExceptions({
        ref: 'addOrder',
        error,
        logger: this.logger,
      });
    }
  }

  async findAll(query: QueryComandaDto) {
    try {
      const comandas = await this.comandaRepository.find({
        where: {
          isActive: true,
          ...(query.state && { state: query.state }),
        },
        relations: {
          products: {
            mainCategory: true,
            category: true,
          },
          orders: {
            user: {
              userType: true,
            },
            products: {
              product: {
                mainCategory: true,
                category: true,
              },
            },
          },
          user: {
            userType: true,
          },
        },
        order: {
          id: 'DESC',
        },
      });

      return comandas;
    } catch (error) {
      this.commonService.handleExceptions({
        ref: 'findAll',
        error,
        logger: this.logger,
      });
    }
  }

  async findAllOrders(query: QueryOrderDto) {
    try {
      const orders = await this.orderRepository.find({
        where: {
          isActive: true,
        },
        relations: {
          products: {
            product: {
              mainCategory: true,
              category: true,
            },
          },
          comanda: {
            user: {
              userType: true,
            },
          },
          user: {
            userType: true,
          },
        },
        order: {
          id: 'ASC',
        },
      });

      if (query.type) {
        return orders.filter(
          (order) =>
            order.products.filter((product) => product.type === query.type)
              .length,
        );
      }

      return orders;
    } catch (error) {
      this.commonService.handleExceptions({
        ref: 'findAllOrders',
        error,
        logger: this.logger,
      });
    }
  }

  async findOne(id: number) {
    try {
      const comanda = await this.comandaRepository.findOne({
        where: {
          id,
          isActive: true,
        },
        relations: {
          products: {
            mainCategory: true,
            category: true,
          },
          orders: {
            user: {
              userType: true,
            },
            products: {
              product: {
                mainCategory: true,
                category: true,
              },
            },
          },
          user: {
            userType: true,
          },
        },
        order: {
          id: 'DESC',
        },
      });

      if (!comanda) {
        throw new NotFoundException('Comanda no encontrada');
      }

      return comanda;
    } catch (error) {
      this.commonService.handleExceptions({
        ref: 'findOne',
        error,
        logger: this.logger,
      });
    }
  }

  async update(id: number, updateComandaDto: UpdateComandaDto) {
    await this.findOne(id);
    try {
      const comandaPreload = await this.comandaRepository.preload({
        id,
        ...updateComandaDto,
      });
      const comanda = await this.comandaRepository.save(comandaPreload);
      await this.commonService.saveAudit(
        actionsConnstants.UPDATE,
        this.getMeesageAudit(comanda),
      );
      return comanda;
    } catch (error) {
      this.commonService.handleExceptions({
        ref: 'update',
        error,
        logger: this.logger,
      });
    }
  }

  remove(id: number) {
    return `This action removes a #${id} comanda`;
  }
}

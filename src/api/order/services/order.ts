/**
 * order service
 */

import { factories } from '@strapi/strapi';
import { DateTime } from "luxon";
import { MealTimings, mealTimeThresholdHours } from '../../../helpers/constants';
import { ErrorFactory } from '../../../errors/helpers';
import { ORDER_ALREADY_ACCEPTED, ORDER_CANCELLED, ORDER_NOT_FOUND, ORDER_UNABLE_TO_UPDATE } from '../../../errors/error-messages';
import { IOrderUpdateRequestBody } from '../type/order';
import { has, pick } from 'lodash';
import { ORDER_API_NAME } from '../controllers/order';

export default factories.createCoreService('api::order.order', ({ strapi}) => ({
  orderCreationTimeValid(mealTime: DateTime, servingTime: MealTimings): boolean {
    const currentDatetime = DateTime.local(); // Current datetime

    const differenceInHours = mealTime.minus({ hours: mealTimeThresholdHours[servingTime]})
      .diff(currentDatetime, 'hours').hours;

    return differenceInHours >= 0;
  },

  async cookOrderUpdate(orderId: number, body: IOrderUpdateRequestBody) {
    if(!has(body, "isAccepted")) {
      throw new ErrorFactory("VALIDATION_ERROR", ORDER_UNABLE_TO_UPDATE)
    }

    const isAccepted = body.isAccepted;

    const orderExists = await this.orderExist(orderId);

    if(orderExists.is_cancelled) throw new ErrorFactory("VALIDATION_ERROR", ORDER_CANCELLED)
    if(orderExists.is_accepted) throw new ErrorFactory("VALIDATION_ERROR", ORDER_ALREADY_ACCEPTED)

    const updatedOrder = await strapi.entityService.update(ORDER_API_NAME, Number(orderId), {
      data: {
        is_accepted: isAccepted,
        processed_at: DateTime.local().toISO()
      }
    })

    return updatedOrder;
  },

  async customerOrderUpdate(orderId: number, body: IOrderUpdateRequestBody) {
    const updateColumns = ["healthIssue", "mealInstructions"]

    const updateData = pick(body, updateColumns);

    await this.orderExist(orderId);

    const updatedOrder = await strapi.entityService.update(ORDER_API_NAME, Number(orderId), {
      data: {
        health_issue: updateData.healthIssue,
        meal_instructions: updateData.mealInstructions
      }
    })

    return updatedOrder;
  },

  async orderExist(orderId: number) {
    const orderExists = await strapi.entityService.findOne(ORDER_API_NAME, Number(orderId));

    if(!orderExists) throw new ErrorFactory("NOT_FOUND_ERROR", ORDER_NOT_FOUND);

    return orderExists;
  },

  async totalCancelledOrdersForMeals(mealIds: string[]) {
    const orders = await strapi.db.query(ORDER_API_NAME).findMany({
      where: {
        meals: {
          id: mealIds
        },
        is_cancelled: true
      },
      populate: ["meals"]
    })

    const mealIdByCount = {};

    orders.forEach(order => {
      const mealId = order.meals[0].id;

      if(!mealIdByCount[mealId]) {
        mealIdByCount[mealId] = 1;
      } else {
        mealIdByCount[mealId]++;
      }
    });

    return mealIdByCount;
  },

  async getOrderById(id: string) {
    const order = await strapi.entityService.findOne(ORDER_API_NAME, Number(id), {
      populate: {
        meals: {
          fields: ["id", "name", "price", "is_special", "rating", "serving_date", "serving_time"]
        },
        users: {
          fields: ["id", "username", "address", "phone_number"]
        }
      }        
    });

    return order;
  }
}));
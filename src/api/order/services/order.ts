/**
 * order service
 */

import { factories } from '@strapi/strapi';
import { DateTime } from "luxon";
import { MealTimings, mealTimeThresholdHours } from '../../../helpers/constants';
import { ErrorFactory } from '../../../errors/helpers';
import { ORDER_ALREADY_ACCEPTED, ORDER_NOT_FOUND, ORDER_UNABLE_TO_UPDATE } from '../../../errors/error-messages';
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
  }
}));
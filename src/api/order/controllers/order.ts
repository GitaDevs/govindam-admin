/**
 * order controller
 */

import { factories } from '@strapi/strapi'
import { IOrderCreateRequestBody, IOrderUpdateRequestBody } from '../type/order';
import { ErrorFactory, handleError } from '../../../errors/helpers';
import { MENU_NOT_FOUND, NEXT_MEAL_NOT_FOUND, ORDER_CREATION_TIME_PASSED, USER_MEAL_ORDER_EXIST } from '../../../errors/error-messages';
import { DateTime } from 'luxon';
import { COOK, CUSTOMER, EVENING, MORNING, MealTimings, mealTimingLimits } from '../../../helpers/constants';
import { MEAL_API_NAME } from '../../meal/controllers/meal';

export const ORDER_API_NAME = "api::order.order";

export default factories.createCoreController(ORDER_API_NAME, ({ strapi}) => ({
  async specialOrderCreate(ctx) {
    try {
      const body = ctx.request.body.data as IOrderCreateRequestBody;
      const userId = ctx.state.user.id;

      const mealId = body.mealId;

      const meal = await strapi.entityService.findOne(MEAL_API_NAME, Number(mealId));

      if(!meal) throw new ErrorFactory("NOT_FOUND_ERROR", MENU_NOT_FOUND);

      const currentMealTime = mealTimingLimits[meal.serving_time as MealTimings];
      const mealTime: DateTime = DateTime.fromFormat(`${meal.serving_date} ${currentMealTime}`, 'yyyy-MM-dd hh:mm a')

      if(!strapi.service(ORDER_API_NAME).orderCreationTimeValid(mealTime, meal.serving_time as MealTimings))
        throw new ErrorFactory("VALIDATION_ERROR", ORDER_CREATION_TIME_PASSED);

      const oldOrder = await strapi.db.query(ORDER_API_NAME).findOne({
        where: {
          meals: {
            id: mealId
          },
          users: {
            id: userId
          }
        },
      });

      if(oldOrder) throw new ErrorFactory("DUPLICATE_ERROR", USER_MEAL_ORDER_EXIST);

      const newOrder = await strapi.entityService.create(ORDER_API_NAME, {
        data: {
          meals: {
            connect: [
              { id: meal.id }
            ]
          },
          users: {
            connect: [
              { id: userId }
            ]
          },
          health_issue: body.healthIssue,
          meal_instructions: body.mealInstructions,
          is_cancelled: body.isCancelled,
          processed_at: body.isCancelled ? DateTime.local().toISO() : null,
          publishedAt: (new Date()).toISOString(),
        },
      })

      const createdOrder = await strapi.service(ORDER_API_NAME).getOrderById(newOrder.id);

      return createdOrder;
    } catch(error) {
      return handleError(error, ctx);
    }
  },

  async specialOrderUpdate(ctx) {
    try {
      const body = ctx.request.body.data as IOrderUpdateRequestBody;
      const { id } = ctx.params;
      const userRole = ctx.state.user.role.type;

      let results;

      if(userRole == COOK) { // cook
        results = await strapi.service(ORDER_API_NAME).cookOrderUpdate(id, body);
      } else { // customer        
        results = await strapi.service(ORDER_API_NAME).customerOrderUpdate(id, body);
      }

      const order = await strapi.service(ORDER_API_NAME).getOrderById(id);

      return order;
    } catch(error) {
      return handleError(error, ctx);
    }
  },

  async specialOrderFetch(ctx) {
    try {
      const userRole = ctx.state.user.role.type;

      if(userRole === CUSTOMER) {
        const specialOrders = await this.fetchSpecialOrderforUser();
        return specialOrders;
      }

      const currentTime = DateTime.local();
      let servingTime = MORNING;

      if(currentTime.hour < 9) {
        servingTime = MORNING;
      } else if(currentTime.hour < 21) {
        servingTime = EVENING;
      }

      const nextMeal = await strapi.db.query(MEAL_API_NAME).findOne({
        where: {
          serving_date: {
            $gte: currentTime.toISODate()
          },
          serving_time: servingTime
        },
        orderBy: { serving_date: 'asc' },
      });

      if(!nextMeal) throw new ErrorFactory("NOT_FOUND_ERROR", NEXT_MEAL_NOT_FOUND);

      const specialOrders = await strapi.entityService.findMany(ORDER_API_NAME, {
        filters: {
          meals: {
            id: nextMeal.id
          }
        },
        populate: {
          meals: {
            fields: ["id", "name", "price", "is_special", "rating", "serving_date", "serving_time"]
          },
          users: {
            fields: ["id", "username", "address", "phone_number"]
          }
        }
      })

      return specialOrders;
    } catch(error) {
      return handleError(error, ctx);
    }
  },

  async fetchSpecialOrderforUser() {
    const nextMeals = await strapi.service(MEAL_API_NAME).getUpcomingMeals(3, ["id"]);

    const specialOrders = await strapi.entityService.findMany(ORDER_API_NAME, {
      filters: {
        meals: {
          id: nextMeals.map(meal => meal.id)
        }
      },
      populate: {
        meals: {
          fields: ["id", "name", "price", "is_special", "rating", "serving_date", "serving_time"]
        },
        users: {
          fields: ["id", "username", "address", "phone_number"]
        }
      }
    })

    return specialOrders;
  }
}));

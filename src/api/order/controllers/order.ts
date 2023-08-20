/**
 * order controller
 */

import { factories } from '@strapi/strapi'
import { IOrderCreateRequestBody, IOrderUpdateRequestBody } from '../type/order';
import { ErrorFactory, handleError } from '../../../errors/helpers';
import { MENU_NOT_FOUND, NOT_SPECIAL_MENU, ORDER_CREATION_TIME_PASSED } from '../../../errors/error-messages';
import { DateTime } from 'luxon';

export const ORDER_API_NAME = "api::order.order";

export default factories.createCoreController(ORDER_API_NAME, ({ strapi}) => ({
  async specialOrderCreate(ctx) {
    try {
      const body = ctx.request.body.data as IOrderCreateRequestBody;
      const userId = ctx.state.user.id;

      const menuId = body.menuId;

      const menu = await strapi.entityService.findOne("api::menu.menu", Number(menuId));

      if(!menu) throw new ErrorFactory("NOT_FOUND_ERROR", MENU_NOT_FOUND);
      if(!menu.is_special) throw new ErrorFactory("VALIDATION_ERROR", NOT_SPECIAL_MENU);

      const menuTime: DateTime = DateTime.fromISO(menu.serving_date_time);

      if(!strapi.service(ORDER_API_NAME).orderCreationTimeValid(menuTime))
        throw new ErrorFactory("VALIDATION_ERROR", ORDER_CREATION_TIME_PASSED);

      const newOrder = await strapi.entityService.create(ORDER_API_NAME, {
        data: {
          menus: {
            connect: [
              { id: menu.id }
            ]
          },
          users: {
            connect: [
              { id: userId }
            ]
          },
          health_issue: body.healthIssue,
          meal_instructions: body.mealInstructions,
          publishedAt: (new Date()).toISOString(),
        },
      })

      const sanitizedResults = await this.sanitizeOutput(newOrder, ctx);
      return this.transformResponse(sanitizedResults);
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

      if(userRole == "cook") { // cook
        results = await strapi.service(ORDER_API_NAME).cookOrderUpdate(id, body);
      } else { // customer        
        results = await strapi.service(ORDER_API_NAME).customerOrderUpdate(id, body);
      }

      const sanitizedResults = await this.sanitizeOutput(results, ctx);
      return this.transformResponse(sanitizedResults);
    } catch(error) {
      return handleError(error, ctx);
    }
  },
}));

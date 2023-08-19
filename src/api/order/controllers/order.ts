/**
 * order controller
 */

import { factories } from '@strapi/strapi'
import { IOrderCreateRequestBody, IOrderUpdateRequestBody } from '../type/order';
import { ErrorFactory, handleError } from '../../../errors/helpers';
import { MENU_NOT_FOUND, NOT_SPECIAL_MENU, ORDER_ALREADY_ACCEPTED, ORDER_CREATION_TIME_PASSED, ORDER_NOT_FOUND, ORDER_UNABLE_TO_UPDATE } from '../../../errors/error-messages';
import { DateTime } from 'luxon';
import { has } from 'lodash';

export default factories.createCoreController('api::order.order', ({ strapi}) => ({
  async specialOrderCreate(ctx) {
    try {
      const body = ctx.request.body as IOrderCreateRequestBody;
      const userId = ctx.state.user.id;

      const menuId = body.menuId;

      const menu = await strapi.entityService.findOne("api::menu.menu", Number(menuId));

      if(!menu) throw new ErrorFactory("NOT_FOUND_ERROR", MENU_NOT_FOUND);
      if(!menu.is_special) throw new ErrorFactory("VALIDATION_ERROR", NOT_SPECIAL_MENU);

      const menuTime: DateTime = DateTime.fromISO(menu.serving_date_time);

      if(!strapi.service("api::order.order").orderCreationTimeValid(menuTime))
        throw new ErrorFactory("VALIDATION_ERROR", ORDER_CREATION_TIME_PASSED);

      const newOrder = await strapi.entityService.create("api::order.order", {
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
      const body = ctx.request.body as IOrderUpdateRequestBody;
      const { id } = ctx.params;
      const userRole = ctx.state.user.role.type;

      let results;

      if(userRole == "cook") { // cook
        results = await strapi.service("api::order.order").cookOrderUpdate(id, body);
      } else { // customer        
        results = await strapi.service("api::order.order").customerOrderUpdate(id, body);
      }

      const sanitizedResults = await this.sanitizeOutput(results, ctx);
      return this.transformResponse(sanitizedResults);
    } catch(error) {
      return handleError(error, ctx);
    }
  },
}));

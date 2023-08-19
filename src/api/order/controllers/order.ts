/**
 * order controller
 */

import { factories } from '@strapi/strapi'
import { IOrderCreateRequestBody, IOrderUpdateRequestBody } from '../type/order';
import { ErrorFactory, handleError } from '../../../errors/helpers';
import { MENU_NOT_FOUND, NOT_SPECIAL_MENU, ORDER_CREATION_TIME_PASSED, ORDER_UNABLE_TO_UPDATE } from '../../../errors/error-messages';
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
          user: {
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

      if(!has(body, "isAccepted")) {
        throw new ErrorFactory("VALIDATION_ERROR", ORDER_UNABLE_TO_UPDATE)
      }

      const isAccepted = body.isAccepted

      const updatedOrder = await strapi.entityService.update("api::order.order", Number(id), {
        data: {
          is_accepted: isAccepted
        }
      })

      const sanitizedResults = await this.sanitizeOutput(updatedOrder, ctx);
      return this.transformResponse(sanitizedResults);
    } catch(error) {
      return handleError(error, ctx);
    }
  }
}));

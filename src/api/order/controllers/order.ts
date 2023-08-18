/**
 * order controller
 */

import { factories } from '@strapi/strapi'
import { IOrderCreateRequestBody } from '../type/order';
import { ErrorFactory } from '../../../errors/helpers';

export default factories.createCoreController('api::order.order', ({ strapi}) => ({
  async specialOrderCreate(ctx) {
    try {
      const body = ctx.request.body as IOrderCreateRequestBody;
      const { user } = ctx.state;

      const menuId = body.menuId;
      const userRole = user.role.type;

      if(!menuId) throw new ErrorFactory("NOT_FOUND_ERROR", "Menu does not exist!");

      const menu = await strapi.entityService.findOne("api::menu.menu", Number(menuId));

      if(!menu) throw new ErrorFactory("NOT_FOUND_ERROR", "Menu does not exist!");

      // const sanitizedResults = await this.sanitizeOutput(menu, ctx);

      // return this.transformResponse(sanitizedResults);
    } catch(error) {
      if(error instanceof ErrorFactory) {
        return error.handleBadRequest(ctx)
      }
    }
  },

  async specialOrderUpdate(ctx) {
    try {
      
    } catch(error) {
      console.log(error);
      throw error;
    }
  }
}));

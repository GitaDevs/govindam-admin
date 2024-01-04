/**
 * raw-item controller
 */

import { factories } from '@strapi/strapi'
import { handleError } from '../../../errors/helpers';

const RAW_ITEM_API_NAME = "api::raw-item.raw-item";

export default factories.createCoreController(RAW_ITEM_API_NAME, ({strapi}) => ({
  async find(ctx) {
    try {
      ctx.query = { ...ctx.query, locale: "en" };

      const rawItems = await strapi.entityService.findMany(RAW_ITEM_API_NAME, {
        ...ctx.query
      });

      return rawItems || [];
    } catch(error) {
      return handleError(error, ctx);
    }
  }
}));

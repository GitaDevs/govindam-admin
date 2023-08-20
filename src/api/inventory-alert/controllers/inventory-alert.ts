/**
 * inventory-alert controller
 */

import { factories } from '@strapi/strapi'
import { IAlertCreateBody } from '../type/inventory-alert';
import { handleError } from '../../../errors/helpers';

export const ALERT_API_NAME = "api::inventory-alert.inventory-alert";

export default factories.createCoreController(ALERT_API_NAME, ({ strapi }) => ({
  async createAlert(ctx) {
    try {
      const body = ctx.request.body.data as IAlertCreateBody;
      const userId = ctx.state.user.id;

      const newAlert = await strapi.entityService.create(ALERT_API_NAME, {
        data: {
          raw_items: {
            connect: [
              { id: body.rawItemsId }
            ]
          },
          created_by_users: {
            connect: [
              { id: userId }
            ]
          },
          publishedAt: (new Date()).toISOString(),
          api: true
        }
      });

      const sanitizedResults = await this.sanitizeOutput(newAlert, ctx);
      return this.transformResponse(sanitizedResults);
    } catch(error) {
      return handleError(error, ctx);
    }
  }
}));
/**
 * user-subscription controller
 */

import { factories } from '@strapi/strapi'
import { USER_SUBS_API_NAME } from '../services/user-subscription';
import { handleError } from '../../../errors/helpers';

export default factories.createCoreController(USER_SUBS_API_NAME, ({strapi}) => ({
  async getActiveSubscription(ctx) {
    try {
      const userId = ctx.state.user.id;

      const userSub = await strapi.service(USER_SUBS_API_NAME).getUserActiveSubsription(userId);

      return userSub;
    } catch(error) {
      return handleError(error, ctx);
    }
  }
}));
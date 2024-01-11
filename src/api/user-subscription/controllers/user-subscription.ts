/**
 * user-subscription controller
 */

import { factories } from '@strapi/strapi'
import { USER_SUBS_API_NAME } from '../services/user-subscription';
import { handleError } from '../../../errors/helpers';
import { ISubPurchaseBody, PaymentDetails } from '../type/user-subscription';

export default factories.createCoreController(USER_SUBS_API_NAME, ({strapi}) => ({
  async getActiveSubscription(ctx) {
    try {
      const userId = ctx.state.user.id;

      const userSub = await strapi.service(USER_SUBS_API_NAME).getUserActiveSubsription(userId);

      return userSub;
    } catch(error) {
      return handleError(error, ctx);
    }
  },

  async purchaseSubscription(ctx) {
    try {
      const body = ctx.request.body as ISubPurchaseBody;
      const userId = ctx.state.user.id;
      const { subId } = body;

      const { validateAndGetSubPurchaseAmount } = strapi.service(USER_SUBS_API_NAME);

      const paymentDetails: PaymentDetails = await validateAndGetSubPurchaseAmount(userId, subId);

      // To Be Continued...
      // create orderLedger
      // generate token for payment
      // make payment request
    } catch(error) {
      return handleError(error, ctx);
    }
  },

  async validatePurchase(ctx) {
    try {
      const body = ctx.request.body as ISubPurchaseBody;
      const userId = ctx.state.user.id;
      const { subId } = body;

      const { validateAndGetSubPurchaseAmount } = strapi.service(USER_SUBS_API_NAME);
      const paymentDetails: PaymentDetails = await validateAndGetSubPurchaseAmount(userId, subId);

      return paymentDetails;
    } catch(error) {
      return handleError(error, ctx);
    }
  }
}));
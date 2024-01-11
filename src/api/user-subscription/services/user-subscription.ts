/**
 * user-subscription service
 */

import { factories } from '@strapi/strapi';
import { DateTime } from 'luxon';
import { ErrorFactory } from '../../../errors/helpers';
import { SUB_DOES_NOT_EXIST, USER_ALREADY_HAS_SUB } from '../../../errors/error-messages';
import { SUB_API_NAME } from '../../subscription/controllers/subscription';
import { DATE_AFTER_FIND_APPLIED, FINE_PER_DAY } from '../../../helpers/constants';
import { PaymentDetails } from '../type/user-subscription';

export const USER_SUBS_API_NAME = 'api::user-subscription.user-subscription';

export default factories.createCoreService(USER_SUBS_API_NAME, ({strapi}) => ({
  async usersCountDiningToday() {
    const currentDate = DateTime.local().startOf('day').toFormat('yyyy-MM-dd');

    const count = await strapi.db.query(USER_SUBS_API_NAME).count({
      where: {
        starts: {
          $lte: currentDate
        },
        ends: {
          $gte: currentDate
        },
        is_active: true
      }
    });

    return count;
  },

  async getUserActiveSubsription(userId: string | number) {
    const currentDate = DateTime.local().startOf('day').toFormat('yyyy-MM-dd');

    const userSub = await strapi.db.query(USER_SUBS_API_NAME).findOne({
      where: {
        users: {
          id: userId
        },
        starts: {
          $lte: currentDate
        },
        ends: {
          $gte: currentDate
        },
        is_active: true        
      }
    })

    return userSub;
  },

  async validateAndGetSubPurchaseAmount(userId: number, subId: number): Promise<PaymentDetails> {
    const userSub = await strapi.service(USER_SUBS_API_NAME).getUserActiveSubsription(userId);

    if(userSub) {
      throw new ErrorFactory("VALIDATION_ERROR", USER_ALREADY_HAS_SUB);
    }

    // check if valid subId
    const subToPurchase = await strapi.entityService.findOne(SUB_API_NAME, Number(subId));

    if(!subToPurchase) {
      throw new ErrorFactory("VALIDATION_ERROR", SUB_DOES_NOT_EXIST);
    }
    
    // calculate fine
    const todayDayOfMonth = DateTime.local().day;
    let totalFineApplied = 0;

    if(todayDayOfMonth > DATE_AFTER_FIND_APPLIED) {
      // take fine
      totalFineApplied = (todayDayOfMonth - DATE_AFTER_FIND_APPLIED)*FINE_PER_DAY;
    }

    const subPurchaseAmount = subToPurchase.price;
    const taxAmount = 0;
    const totalPayableAmount = subPurchaseAmount + totalFineApplied + taxAmount;

    return {
      subAmount: subPurchaseAmount,
      taxAmount,
      fineAmount: totalFineApplied,
      totalAmount: totalPayableAmount
    };
  }
}));

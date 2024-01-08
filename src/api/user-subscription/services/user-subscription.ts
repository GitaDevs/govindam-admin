/**
 * user-subscription service
 */

import { factories } from '@strapi/strapi';
import { DateTime } from 'luxon';

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
  }
}));

/**
 * meal service
 */

import { factories } from '@strapi/strapi';
import { MEAL_API_NAME } from '../controllers/meal';
import { DateTime } from 'luxon';

export default factories.createCoreService(MEAL_API_NAME, ({strapi}) => ({
  async getUpcomingMeals(limit = 3, select: string[] = []) {
    const currentTime = DateTime.local();
    
    const params = {
      select,
      where: {
        serving_date: {
          $gte: currentTime.toISODate()
        },
      },
      orderBy: { serving_date: 'asc' },
      limit,
    };

    const nextMeals = await strapi.db.query(MEAL_API_NAME).findMany(params);

    return nextMeals;
  }
}));

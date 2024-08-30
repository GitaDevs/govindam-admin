/**
 * rating controller
 */

import { factories } from '@strapi/strapi'
import { ErrorFactory, handleError } from '../../../errors/helpers';
import { IRatingCreateBody } from '../type/rating';
import { MEAL_TIMING_WINDOW, mealDisappearTimingLimits, mealTimingLimits, MealTimings } from '../../../helpers/constants';
import { MEAL_API_NAME } from '../../meal/controllers/meal';
import { MENU_NOT_FOUND } from '../../../errors/error-messages';
import { DateTime } from 'luxon';
import { DateTimeLocal } from '../../../helpers/helpers';

export const RATING_API_NAME = 'api::rating.rating';

export default factories.createCoreController(RATING_API_NAME, ({strapi}) => ({
  async create(ctx) {
    try {
      const body = ctx.request.body.data as IRatingCreateBody;
      const userId = ctx.state.user.id;

      const mealId = body.mealId;

      const meal = await strapi.entityService.findOne(MEAL_API_NAME, Number(mealId));

      if(!meal) throw new ErrorFactory("NOT_FOUND_ERROR", MENU_NOT_FOUND);

      const limit = mealDisappearTimingLimits[meal.serving_time];
      const startDateTime = DateTime.fromFormat(`${meal.serving_date} ${limit}`, 'yyyy-MM-dd hh:mm a').minus({hours: MEAL_TIMING_WINDOW});

      if(DateTimeLocal.local() < startDateTime) {
        throw new ErrorFactory("VALIDATION_ERROR", "You can only rate meals that are already served or is being served");
      }

      if(body.rating < 1 || body.rating > 5) {
        throw new ErrorFactory("VALIDATION_ERROR", "Rating must be between 1 and 5");
      }

      const rating = await strapi.entityService.create(RATING_API_NAME, {
        data: {
          meals: {
            connect: [
              { id: meal.id }
            ]
          },
          users: {
            connect: [
              { id: userId }
            ]
          },
          comment: body.comment || "",
          rating: body.rating,
          publishedAt: (new Date()).toISOString(),
        }
      });

      const ratingResp = await strapi.entityService.findOne(RATING_API_NAME, Number(rating.id), {
        populate: {
          meals: true
        }
      });

      const sanitizedResults = await this.sanitizeOutput(ratingResp, ctx);
      return sanitizedResults;
    } catch(error) {
      return handleError(error, ctx);
    }
  },
  
  async find(ctx) {
    try {
      const userId = ctx.state.user.id;
      const ratings = await strapi.entityService.findMany(RATING_API_NAME, {
        ...ctx.query,
        filters: {
          users: {
            id: userId
          },
          ...ctx.query.filters
        }
      });

      const sanitizedResults = await this.sanitizeOutput(ratings, ctx);
      return sanitizedResults;
    } catch(error) {
      return handleError(error, ctx);
    }
  },
}));

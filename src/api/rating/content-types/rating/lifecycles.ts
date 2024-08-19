import { ErrorFactory } from "../../../../errors/helpers";
import { MEAL_API_NAME } from "../../../meal/controllers/meal";
import { RATING_API_NAME } from "../../controllers/rating";

const RATING_ALREADY_EXIST = "Rating already exists for this meal by the user."

export default {
  async beforeCreate(event) {
    const { data } = event.params;

    const userId = data.users.connect[0].id
    const mealIds = data.meals.connect.map(data => data.id);
  
    const ratingExists = await strapi.db.query(RATING_API_NAME).findOne({
      where: {
        users: userId,
        meals: mealIds
      },
    })
  
    if (ratingExists) {
      throw new ErrorFactory("DUPLICATE_ERROR", RATING_ALREADY_EXIST);
    }
  },

  async afterCreate(event) {
    const { data } = event.params;

    const mealIds = data.meals.connect.map(data => data.id);

    const ratings = await strapi.entityService.findMany(RATING_API_NAME, {
      where: {
        meals: mealIds
      },
      populate: ["rating"]
    })

    const totalRating = ratings.reduce((acc, r) => {
      return acc + r.rating;
    }, 0);

    await strapi.entityService.update(MEAL_API_NAME, Number(mealIds[0]), {
      data: {
        rating: (totalRating/ratings.length).toFixed(2)
      }
    })
  }
}
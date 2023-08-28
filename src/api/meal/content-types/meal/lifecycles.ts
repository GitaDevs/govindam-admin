import { MENU_API_NAME } from "../../../menu/controllers/menu";
import { MEAL_API_NAME } from "../../controllers/meal";
import { validateMealDateTimeIsValid } from "./lifecycle-helpers";

export default {
  async beforeCreate(event) {
    const { data } = event.params;

    const menuId = data.menu.connect[0].id;

    if(!menuId) return;

    const menuData = await strapi.db.query(MENU_API_NAME).findOne({
      where: {
        id: menuId
      }
    })

    const mealMenuData = {
      serving_date_time: data.serving_date_time,
      menu: {
        valid_from: menuData.valid_from,
        valid_till: menuData.valid_till,
      }
    }

    await validateMealDateTimeIsValid(mealMenuData);
  },

  async beforeUpdate(event) {
    const mealId = event.params.where.id;
    const { data } = event.params;

    if(!mealId) return;
  
    const mealData = await strapi.db.query(MEAL_API_NAME).findOne({
      where: {
        id: mealId
      },
      populate: ["menu"]
    });

    const mealMenuData = {
      serving_date_time: data.serving_date_time,
      menu: {
        valid_from: mealData.menu.valid_from,
        valid_till: mealData.menu.valid_till,
      }
    }

    await validateMealDateTimeIsValid(mealMenuData);
  }
}
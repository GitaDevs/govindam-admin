/**
 * menu controller
 */

import { factories } from '@strapi/strapi'
import { handleError } from '../../../errors/helpers';
import { INGREDIENT_API_NAME } from '../../ingredient/controllers/ingredient';

export const MENU_API_NAME = "api::menu.menu";

export default factories.createCoreController(MENU_API_NAME, ({strapi}) => ({
  async find(ctx) {
    try {
      ctx.query = { ...ctx.query, locale: "en" };

      const menuWithMeals = await strapi.entityService.findMany(MENU_API_NAME, {
        ...ctx.query
      });

      const rawItemsByDishId: {[key: string | number]: any[] } = {};

      (menuWithMeals || []).forEach(menu => {
        (menu?.meals || []).forEach(meal => {
          (meal?.dishes || []).forEach(dish => {
            if(rawItemsByDishId[dish.id]) return;

            rawItemsByDishId[dish.id] = [];
          });
        });
      });

      const populate = ['raw_item', 'dish','raw_item.categories', 'raw_item.sub_categories', 'raw_item.purchasing_unit','raw_item.consumption_unit'];
      const rawItems = await strapi.db.query(INGREDIENT_API_NAME).findMany({
        where: {
          dish: {
            id: Object.keys(rawItemsByDishId)
          }
        },
        populate
      });

      rawItems.forEach(rawItem => {
        const dishId = rawItem?.dish?.id;
        if(!dishId) return;

        rawItemsByDishId[dishId].push({ ...rawItem.raw_item, quantity: rawItem.quantity });
      });

      (menuWithMeals || []).forEach(menu => {
        (menu?.meals || []).forEach(meal => {
          (meal?.dishes || []).forEach(dish => {
            if(!rawItemsByDishId[dish.id]) return;

            dish.raw_items = rawItemsByDishId[dish.id];
          });
        });
      });

      const sanitizedResults = await this.sanitizeOutput(menuWithMeals, ctx);

      return { success: true, data: sanitizedResults };
    } catch(error) {
      return handleError(error, ctx);
    } 
  }  
}));

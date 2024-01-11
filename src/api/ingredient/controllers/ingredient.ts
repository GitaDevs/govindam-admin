/**
 * ingredient controller
 */

import { factories } from '@strapi/strapi'

export const INGREDIENT_API_NAME = 'api::ingredient.ingredient';

export default factories.createCoreController(INGREDIENT_API_NAME);

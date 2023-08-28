/**
 * meal controller
 */

import { factories } from '@strapi/strapi'

export const MEAL_API_NAME = 'api::meal.meal';

export default factories.createCoreController(MEAL_API_NAME);

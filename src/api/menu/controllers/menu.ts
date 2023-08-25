/**
 * menu controller
 */

import { factories } from '@strapi/strapi'

export const MENU_API_NAME = "api::menu.menu";

export default factories.createCoreController(MENU_API_NAME);

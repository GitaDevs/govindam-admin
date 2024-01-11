/**
 * subscription controller
 */

import { factories } from '@strapi/strapi'

export const SUB_API_NAME = 'api::subscription.subscription';

export default factories.createCoreController(SUB_API_NAME);

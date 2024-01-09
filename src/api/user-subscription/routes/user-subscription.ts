/**
 * user-subscription router
 */

import { factories } from '@strapi/strapi';
import { USER_SUBS_API_NAME } from '../services/user-subscription';

export default factories.createCoreRouter(USER_SUBS_API_NAME);

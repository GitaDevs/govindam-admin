/**
 * order service
 */

import { factories } from '@strapi/strapi';
import { DateTime } from "luxon";
import { ACCEPT_ORDER_REQUEST_BEFORE } from '../../../helpers/constants';

export default factories.createCoreService('api::order.order', ({ strapi}) => ({
  orderCreationTimeValid(menuTime: DateTime): boolean {
    const currentDatetime = DateTime.local(); // Current datetime

    const differenceInHours = menuTime.diff(currentDatetime, 'hours').hours;

    return differenceInHours >= ACCEPT_ORDER_REQUEST_BEFORE;
  }
}));
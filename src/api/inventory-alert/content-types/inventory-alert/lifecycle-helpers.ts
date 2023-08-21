import { DateTime } from "luxon";
import { ALERT_ALREADY_EXISTS, ALERT_NOT_FOUND } from "../../../../errors/error-messages";
import { ErrorFactory } from "../../../../errors/helpers";
import { ALERT_API_NAME } from "../../controllers/inventory-alert";
import { isAdmin } from "../../../../helpers/helpers";

export async function lastAlertFullFilled(data) {
  // if request not coming from custom api, return
  if(!data.api) return;

  const userId = data.created_by_users.connect[0].id;
  const rawItemIds = data.raw_items.connect.map(data => data.id);

  const alert = await strapi.db.query(ALERT_API_NAME).findOne({
    where: {
      created_by_users: userId,
      raw_items: rawItemIds,
      request_fullfilled: false
    },
  })

  if(alert) throw new ErrorFactory("DUPLICATE_ERROR", ALERT_ALREADY_EXISTS);
}

export async function updateRequestedUser(data) {
  const ctx = strapi.requestContext.get();

  if(isAdmin(ctx.state.user)) {
    // allow admin to override all fields
    return;
  }

  const userId = ctx.state.user.id;
  const alertId = Number(ctx.params.id)

  const alertData = await strapi.entityService.findOne(ALERT_API_NAME, alertId);

  if(!alertData) throw new ErrorFactory("NOT_FOUND_ERROR", ALERT_NOT_FOUND);
  
  if(!alertData.request_fullfilled && data.request_fullfilled) {
    data.request_fullfilled_at = DateTime.local().toISO();
    data.request_fullfilled_by_users = userId;
  } else if(alertData.request_fullfilled) {
    delete data.request_fullfilled;
    delete data.request_fullfilled_at;
    delete data.request_fullfilled_by_users;
  }
}
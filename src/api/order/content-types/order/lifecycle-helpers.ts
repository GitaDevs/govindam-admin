import { ApplicationError } from "@strapi/utils/dist/errors";
import { USER_MENU_SHOULD_UNIQUE_IN_ORDER } from "../../../../errors/error-messages";
import { ErrorFactory } from "../../../../errors/helpers";

export async function validateUserAndMenuUnique(data) {
  const userId = data.user.connect[0].id
  const menuIds = data.menus.connect.map(data => data.id);

  const orderExists = await strapi.db.query('api::order.order').findOne({
    where: {
      user: userId,
      menus: menuIds
    },
  })

  if (orderExists) {
    throw new ErrorFactory("DUPLICATE_ERROR", USER_MENU_SHOULD_UNIQUE_IN_ORDER);
  }
}
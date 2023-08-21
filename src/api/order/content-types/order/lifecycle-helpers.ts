import { USER_MENU_SHOULD_UNIQUE_IN_ORDER } from "../../../../errors/error-messages";
import { ErrorFactory } from "../../../../errors/helpers";
import { ORDER_API_NAME } from "../../controllers/order";

export async function validateUserAndMenuUnique(data) {
  const userId = data.users.connect[0].id
  const menuIds = data.menus.connect.map(data => data.id);

  const orderExists = await strapi.db.query(ORDER_API_NAME).findOne({
    where: {
      users: userId,
      menus: menuIds
    },
  })

  if (orderExists) {
    throw new ErrorFactory("DUPLICATE_ERROR", USER_MENU_SHOULD_UNIQUE_IN_ORDER);
  }
}
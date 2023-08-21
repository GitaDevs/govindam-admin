import { ADMIN_NAME, SUPER_ADMIN_NAME } from "./constants";

export function isAdmin(user): boolean {
  if(!user) return false;

  if(Array.isArray(user.roles)) {
    return user.roles.find(role => role?.name === SUPER_ADMIN_NAME || role?.name === ADMIN_NAME);
  } else if(user.role) {
    if(user.role.name === SUPER_ADMIN_NAME || user.role.name === ADMIN_NAME)
      return true;

    return false;
  }
}
import { CUSTOMER } from "../helpers/constants";

export default (policyContext, config, { strapi }) => {
  if (policyContext.state.user.role.type === CUSTOMER) {
    return true;
  }

  return false;
};
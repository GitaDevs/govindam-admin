import { COOK } from "../helpers/constants";

export default (policyContext, config, { strapi }) => {
  if (policyContext.state.user.role.type === COOK) {
    return true;
  }

  return false;
};
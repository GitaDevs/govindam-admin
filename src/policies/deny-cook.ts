export default (policyContext, config, { strapi }) => {
  if (policyContext.state.user.role.type === 'cook') {
    return false;
  }

  return true;
};
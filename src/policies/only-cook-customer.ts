export default (policyContext, config, { strapi }) => {
  const roleType = policyContext.state.user.role.type;
  
  if (roleType === 'customer' || roleType === 'cook') {
    return true;
  }

  return false;
};
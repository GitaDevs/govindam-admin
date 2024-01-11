module.exports = {
  routes: [
    {
      method: "GET",
      path: "/user-subs",
      handler: "user-subscription.getActiveSubscription",
      config: {
        policies: ["global::only-customer"]
      }
    },
    {
      method: "POST",
      path: "/user-subs/pay",
      handler: "user-subscription.purchaseSubscription"
    },
    {
      method: "POST",
      path: "/user-subs/validate",
      handler: "user-subscription.validatePurchase"
    }
  ],
};
module.exports = {
  routes: [
    {
      method: "GET",
      path: "/user-subs",
      handler: "user-subscription.getActiveSubscription",
      config: {
        policies: ["global::only-customer"]
      }
    }
  ],
};
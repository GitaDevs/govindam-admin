module.exports = {
  routes: [
    {
      method: "POST",
      path: "/inventory-alerts",
      handler: "inventory-alert.createAlert",
      config: {
        policies: ["global::only-cook"]
      }
    }
  ],
};
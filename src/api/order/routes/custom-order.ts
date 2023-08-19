module.exports = {
  routes: [
    {
      method: "POST",
      path: "/special-order",
      handler: "order.specialOrderCreate",
      config: {
        policies: ["global::deny-cook"]
      }
    },
    {
      method: "PUT",
      path: "/special-order/:id",
      handler: "order.specialOrderUpdate",
      config: {
        policies: ["global::only-cook-customer"]
      }
    },
  ],
};
module.exports = {
  routes: [
    {
      method: "POST",
      path: "/special-order",
      handler: "order.specialOrderCreate",
    },
    {
      method: "PUT",
      path: "/special-order",
      handler: "order.specialOrderUpdate",
    },
  ],
};
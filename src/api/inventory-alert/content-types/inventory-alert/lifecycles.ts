import { lastAlertFullFilled, updateRequestedUser } from "./lifecycle-helpers";

export default {
  async beforeCreate(event) {
    const { data } = event.params;

    await lastAlertFullFilled(data);
  },

  async beforeUpdate(event) {
    const { data } = event.params;

    await updateRequestedUser(data);
  }
}
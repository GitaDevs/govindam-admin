import { validateUserAndMenuUnique } from "./lifecycle-helpers";

export default {
  async beforeCreate(event) {
    const { data } = event.params;

    await validateUserAndMenuUnique(data)  
  },
}
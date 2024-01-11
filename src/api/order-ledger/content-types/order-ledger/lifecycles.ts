import { v4 as uuidv4 } from 'uuid';

export default {
  async beforeCreate(event) {
    const { data } = event.params;

    data.order_ledger_id = uuidv4();
  },
}
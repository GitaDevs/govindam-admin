export const ACCEPT_ORDER_REQUEST_BEFORE = 3; // in hours
export const ADMIN_NAME = "admin";
export const SUPER_ADMIN_NAME = "Super Admin";
export const COOK = "cook";
export const CUSTOMER = "customer";

export const MORNING = "morning";
export const NOON = "noon";
export const EVENING = "evening";

export type MealTimings = typeof MORNING | typeof NOON | typeof EVENING;

export const mealTimingLimits: {[key: string]: string} = {
  [MORNING]: "09:00 AM",
  [NOON]: "03:00 PM",
  [EVENING]: "09:00 PM"
}

// How many hours before special
// order is accepted by the system
export const mealTimeThresholdHours: {[key: string]: number} = {
  [MORNING]: 12,
  [NOON]: 9,
  [EVENING]: 9
}
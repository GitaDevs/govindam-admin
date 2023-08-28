import { DateTime } from "luxon";
import { ErrorFactory } from "../../../../errors/helpers";
import { MEAL_TIME_INVALID } from "../../../../errors/error-messages";

export async function validateMealDateTimeIsValid(mealMenuData) {
  if(!mealMenuData || !mealMenuData.serving_date_time) return;

  const { menu } = mealMenuData;
  if(!menu || !menu.valid_from || !menu.valid_till) return;

  const mealvalidFrom = DateTime.fromISO(menu.valid_from);
  const mealvalidTill = DateTime.fromISO(menu.valid_till);
  const mealServingTime = DateTime.fromISO(mealMenuData.serving_date_time);

  const diff1 = mealServingTime.diff(mealvalidFrom, 'hours').hours;
  const diff2 = mealvalidTill.diff(mealServingTime, 'hours').hours;

  console.log(mealMenuData, diff1, diff2);

  if(diff1 < 0 || diff2 < 0) {
    throw new ErrorFactory("APP_ERROR", MEAL_TIME_INVALID);
  }
}
import { DateTime } from "luxon";
import { ErrorFactory } from "../../../../errors/helpers";
import { MEAL_TIME_INVALID } from "../../../../errors/error-messages";
import { MealTimings, mealTimingLimits } from "../../../../helpers/constants";

export async function validateMealDateTimeIsValid(mealMenuData) {
  if(!mealMenuData || !mealMenuData.serving_date || !mealMenuData.serving_time) return;

  const { menu } = mealMenuData;
  if(!menu || !menu.valid_from || !menu.valid_till) return;

  const mealvalidFrom = DateTime.fromISO(menu.valid_from);
  const mealvalidTill = DateTime.fromISO(menu.valid_till);
  
  const currentMealTime = mealTimingLimits[mealMenuData.serving_time as MealTimings];
  const mealServingTime: DateTime = DateTime.fromFormat(`${mealMenuData.serving_date} ${currentMealTime}`, 'dd-MM-yyyy h:mm a')

  const diff1 = mealServingTime.diff(mealvalidFrom, 'hours').hours;
  const diff2 = mealvalidTill.diff(mealServingTime, 'hours').hours;

  if(diff1 < 0 || diff2 < 0) {
    throw new ErrorFactory("APP_ERROR", MEAL_TIME_INVALID);
  }
}
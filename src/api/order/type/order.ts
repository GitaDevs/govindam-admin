export interface IOrderCreateRequestBody {
  mealId: number;
  isCancelled?: boolean;
  healthIssue?: string;
  mealInstructions?: string;
}

export interface IOrderUpdateRequestBody {
  isAccepted?: boolean;
  healthIssue?: string;
  mealInstructions?: string;
}
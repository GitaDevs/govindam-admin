export interface IOrderCreateRequestBody {
  menuId: number;
  healthIssue?: string;
  mealInstructions?: string;
}

export interface IOrderUpdateRequestBody {
  isAccepted?: boolean;
  healthIssue?: string;
  mealInstructions?: string;
}
export interface IOrderCreateRequestBody {
  menuId: number;
  healthIssue?: string;
  mealInstructions?: string;
  is_accepted?: boolean;
}
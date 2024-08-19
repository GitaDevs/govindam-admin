export interface IRatingCreateBody {
  mealId: number;
  comment?: string;
  userId?: number;
  rating: number;
}
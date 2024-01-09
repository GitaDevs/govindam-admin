export interface IAlertCreateBody {
  rawItemsId: number;
  requestFullFilled?: boolean;
  description?: string;
}

export type IAlertUpdateBody = Partial<IAlertCreateBody>
export interface IAlertCreateBody {
  rawItemsId: number;
  requestFullFilled?: boolean;
}

export type IAlertUpdateBody = Partial<IAlertCreateBody>
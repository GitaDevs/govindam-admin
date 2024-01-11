export interface ISubPurchaseBody {
  subId: number;
}

export interface PaymentDetails {
  totalAmount: number;
  fineAmount: number;
  taxAmount: number;
  subAmount: number;
}
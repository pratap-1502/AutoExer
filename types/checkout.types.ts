import type { Address } from './user.types';
export interface CheckoutData {
  readonly address: Address;
  readonly orderComment: string;
  readonly payment: {
    readonly nameOnCard: string;
    readonly cardNumber: string;
    readonly cvc: string;
    readonly expiryMonth: string;
    readonly expiryYear: string;
  };
  readonly expectedConfirmation: string;
}

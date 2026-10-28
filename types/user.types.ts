export interface Address {
  readonly firstName: string;
  readonly lastName: string;
  readonly company: string;
  readonly address1: string;
  readonly address2: string;
  readonly country: string;
  readonly state: string;
  readonly city: string;
  readonly zipcode: string;
  readonly mobileNumber: string;
}
export interface UserTemplate {
  readonly id: string;
  readonly name: string;
  readonly emailPrefix: string;
  readonly password: string;
  readonly title: 'Mr' | 'Mrs';
  readonly birthDate: string;
  readonly birthMonth: string;
  readonly birthYear: string;
  readonly address: Address;
}
export interface TestUser extends UserTemplate {
  readonly email: string;
}
export interface InvalidUser {
  readonly id: string;
  readonly email: string;
  readonly password: string;
  readonly expectedError: string;
  readonly browserValidation?: boolean;
}

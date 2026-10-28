export interface ProductData {
  readonly id: number;
  readonly name: string;
  readonly category: string;
  readonly price: string;
  readonly quantity: number;
  readonly availability: string;
  readonly condition: string;
  readonly searchKeyword: string;
}
export interface SearchData {
  readonly id: string;
  readonly keyword: string;
  readonly expectedProducts: readonly string[];
  readonly expectResults: boolean;
}
export interface ReviewData {
  readonly name: string;
  readonly email: string;
  readonly message: string;
}

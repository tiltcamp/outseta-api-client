export default interface Address {
  AddressLine1?: string;
  AddressLine2?: string;
  AddressLine3?: string;
  City: string;
  State: string;
  PostalCode: string;
  Country?: string;
  Uid?: string;
  Created?: Date;
  Updated?: Date;
}

import Address from "../../../@shared/domain/value-object/address";

export interface GenerateInvoiceUseCaseInputDto {
  id?: string;
  name: string;
  document: string;
  address: Address;
  items: {
    id: string;
    name: string;
    price: number;
  }[];
}

export interface GenerateInvoiceUseCaseOutputDto {
  id: string;
  name: string;
  document: string;
  address: Address;
  items: {
    id: string;
    name: string;
    price: number;
  }[];
  total: number;
}

export class CustomerCardDto {
  card_number: string;
  cust_name: string;
  cust_surname: string;
  cust_patronimic?: string;
  phone_number: string;
  city?: string;
  street?: string;
  zip_code?: string;
  percent: number;
}

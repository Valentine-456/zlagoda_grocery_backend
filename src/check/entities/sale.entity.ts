export class Sale {
  upc: string;
  check_number: string;
  product_number: number;
  selling_price: number;
}

export class SaleExpanded extends Sale {
  id_employee: string;
  card_number: string;
  print_date: string;
  sum_total: string;
  vat: string;
  product_name: string;
  charachteristics: string;
  promotional_product: boolean;
}

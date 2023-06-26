import { SaleDto } from './sale.dto';

export class CheckDto {
  check_number: string;
  id_employee: string;
  card_number?: string;
  print_date: Date;
  // sum_total?: number;
  sales: Array<SaleDto>;
}

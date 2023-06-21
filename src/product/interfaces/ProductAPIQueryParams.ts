import { APIQueryParams } from 'src/common/QueryParamUtils';

export interface ProductAPIQueryParams extends APIQueryParams {
  category?: string;
}

export class QueryParamUtils {
  static sortByParamToSQL(sortBy: string): string {
    if (sortBy == null || sortBy?.length < 2) return '';
    const isDescending: boolean = sortBy[0] == '-';
    const parameterToSortBy = isDescending ? sortBy.slice(1) : sortBy;
    if (isDescending) return ` ORDER BY ${parameterToSortBy} DESC`;
    else return ` ORDER BY ${parameterToSortBy} ASC`;
  }
}

export interface APIQueryParams {
  sortBy?: string;
}

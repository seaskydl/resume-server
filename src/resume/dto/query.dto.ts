export class QueryDto {
  readonly page: number;
  readonly limit: number;
  constructor(object: any) {
    this.page = object.page || 1;
    this.limit = object.limit || 10;
  }
}

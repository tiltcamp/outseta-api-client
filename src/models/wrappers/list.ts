export default interface List<T> {
  metadata: Metadata;
  items: T[];
}

export interface Metadata {
  limit: number;
  offset: number;
  total: number;
}

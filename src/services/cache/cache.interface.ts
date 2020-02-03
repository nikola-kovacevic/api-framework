export interface CacheOptions {
  host?: string;
  port?: number;
  password?: string;
  db?: number;
  reconnectOnError?: boolean;
  autoResubscribe?: boolean;
}

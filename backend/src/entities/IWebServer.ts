export interface IWebServer {
  start(port: number | string): Promise<void>;
  stop(): Promise<void>;
}

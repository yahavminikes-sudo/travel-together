export interface DocRoute {
  path: string;
  handlers: any[];
}

export interface IDocsProvider {
  getRoutes(): DocRoute[];
}

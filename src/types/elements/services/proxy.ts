import { RequestOptions } from './shared';

type BasisTheoryProxyHeaders = {
  [key: string]: string;
  'BT-PROXY-URL': string;
  'BT-PROXY-KEY': string;
};

type ProxyHeaders = Partial<BasisTheoryProxyHeaders>;

type BasisTheoryQueryParams = {
  [key: string]: string;
  'bt-proxy-key': string;
};

type ProxyQuery = Partial<BasisTheoryQueryParams>;

interface ProxyRequestOptions extends RequestOptions {
  includeResponseHeaders?: boolean;
  path?: string;
  query?: ProxyQuery;
  headers?: ProxyHeaders;
  body?: unknown;
}

interface Proxy {
  get(options?: ProxyRequestOptions): Promise<unknown>;
  post(options?: ProxyRequestOptions): Promise<unknown>;
  patch(options?: ProxyRequestOptions): Promise<unknown>;
  put(options?: ProxyRequestOptions): Promise<unknown>;
  delete(options?: ProxyRequestOptions): Promise<unknown>;
}

export type { Proxy, ProxyRequestOptions };

import { RequestOptions } from './shared';

type CreateSessionResponse = {
  sessionKey: string;
  nonce: string;
  expiresAt: string;
  _debug?: Record<string, unknown>;
};

interface Sessions {
  create(options?: RequestOptions): Promise<CreateSessionResponse>;
}

export { CreateSessionResponse, Sessions };

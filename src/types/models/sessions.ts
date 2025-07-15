type CreateSessionResponse = {
  sessionKey: string;
  nonce: string;
  expiresAt: string;
  _debug?: Record<string, unknown>;
};

export { CreateSessionResponse };

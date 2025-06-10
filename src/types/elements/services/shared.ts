interface RequestOptions {
  apiKey?: string;
  correlationId?: string;
  idempotencyKey?: string;
}

type Create<T, C> = {
  create(model: C, options?: RequestOptions): Promise<T>;
};

type Retrieve<T> = {
  retrieve(id: string, options?: RequestOptions): Promise<T>;
};

type Update<T, U> = {
  update(id: string, model: U, options?: RequestOptions): Promise<T>;
};

type Patch<P> = {
  patch(id: string, model: P, options?: RequestOptions): Promise<void>;
};

type Delete = {
  delete(id: string, options?: RequestOptions): Promise<void>;
};

type Encrypt<E, T> = {
  encrypt(model: T, options?: RequestOptions): Promise<E>;
};

export { RequestOptions, Create, Retrieve, Update, Delete, Patch, Encrypt };

export class BasisTheoryConfigurationError<
  Details = Record<string, unknown>
> extends Error {
  public constructor(message: string, public readonly details: Details) {
    super(message);
    this.name = 'BasisTheoryConfigurationError';

    Object.setPrototypeOf(this, BasisTheoryConfigurationError.prototype);
  }
}

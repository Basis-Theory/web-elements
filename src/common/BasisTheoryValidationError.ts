import type { FieldError } from '~/types/elements';

export class BasisTheoryValidationError<
  Details = Record<string, unknown>
> extends Error {
  public constructor(
    message: string,
    public readonly details: Details,
    /**
     * @deprecated use {@link details}
     */
    public readonly validation?: FieldError[]
  ) {
    super(message);
    this.name = 'BasisTheoryValidationError';

    Object.setPrototypeOf(this, BasisTheoryValidationError.prototype);
  }
}

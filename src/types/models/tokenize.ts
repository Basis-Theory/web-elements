import type { Primitive } from './shared';

type TokenizeObject<DataType = Primitive> = {
  [key: string]:
    | Primitive
    | TokenizeObject<DataType>
    | TokenizeArray<DataType>
    | DataType;
};
type TokenizeArray<DataType = Primitive> = Array<
  Primitive | TokenizeObject<DataType> | TokenizeArray<DataType> | DataType
>;
type TokenizeDataModel<DataType = Primitive> =
  | TokenizeArray<DataType>
  | (TokenizeObject<DataType> & {
      _debug?: Record<string, unknown>;
    });

export type { TokenizeArray, TokenizeDataModel, TokenizeObject };

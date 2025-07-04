import type {
  TokenBase,
  DataObject,
  Auditable,
  TokenType,
  IssuerCountry,
} from '../../types/models';

interface TokenIntentCardDetails {
  type: 'card';
  card: {
    bin: string;
    last4: string;
    brand: string;
    funding: string;
    expirationMonth: number;
    expirationYear: number;
    issuerCountry?: IssuerCountry;
  };
}

interface TokenIntentBankDetails {
  type: 'bank';
  bank: {
    routingNumber: string;
    accountNumberLast4: string;
  };
}

type TokenTypesForTokenIntents = Exclude<TokenType, 'token' | 'card' | 'bank'>;

type TokenTypeMap = {
  [K in TokenTypesForTokenIntents]: {
    type: K;
  } & Record<K, Record<string, unknown>>;
};

type TokenIntent<DataType = DataObject> = (TokenBase<DataType> &
  Omit<Auditable, 'modifiedAt' | 'modifiedBy'> & {
    id: string;
    tenantId: string;
    expiresAt: string;
    fingerprint?: string;
    _debug?: Record<string, unknown>;
  }) &
  (
    | TokenTypeMap[TokenTypesForTokenIntents]
    | TokenIntentCardDetails
    | TokenIntentBankDetails
    | {
        type: 'token';
      }
  );

type CreateTokenIntent<DataType = DataObject> = Pick<
  TokenIntent<DataType>,
  'type' | 'data'
>;

export type {
  TokenIntent,
  CreateTokenIntent as CreateTokenIntentModel,
  TokenIntentCardDetails,
};

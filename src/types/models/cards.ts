interface Card {
  number: string;
  expirationMonth?: number;
  expirationYear?: number;
  cvc?: string;
}

interface IssuerCountry {
  alpha2: string;
  name: string;
  numeric: string;
}

export type { Card, IssuerCountry };

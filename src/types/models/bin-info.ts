interface CardIssuerDetails {
  country: string;
  name: string;
}

interface CardInfo {
  brand: string;
  funding: string;
  issuer: CardIssuerDetails;
}

interface BinInfo {
  brand: string;
  funding: string;
  issuer: CardIssuerDetails;
  segment: string;
  additional?: CardInfo[];
}

export type { BinInfo };

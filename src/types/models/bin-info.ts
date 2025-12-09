interface CardIssuerDetails {
  country: string;
  name: string;
}

interface BinRange {
  binMin: string;
  binMax: string;
}

interface CardInfo {
  brand: string;
  funding: string;
  issuer: CardIssuerDetails;
  binRange?: BinRange[];
}

interface BinInfo {
  brand?: string;
  funding?: string;
  issuer?: CardIssuerDetails;
  segment?: string;
  additional?: CardInfo[];
  binRange?: BinRange[];
}

export type { BinInfo, BinRange };

interface BinDetails {
  cardBrand?: string;
  type?: string;
  prepaid?: boolean;
  cardSegmentType?: string;
  reloadable?: boolean;
  panOrToken?: string;
  accountUpdater?: boolean;
  alm?: boolean;
  domesticOnly?: boolean;
  gamblingBlocked?: boolean;
  level2?: boolean;
  level3?: boolean;
  issuerCurrency?: string;
  comboCard?: string;
  binLength?: number;
  authentication?: unknown;
  cost?: unknown;
  bank?: BinDetailsBank;
  country?: BinDetailsCountry;
  product?: BinDetailsProduct;
}

interface BinDetailsBank {
  name?: string;
  phone?: string;
  url?: string;
  cleanName?: string;
}

interface BinDetailsCountry {
  alpha2?: string;
  name?: string;
  numeric?: string;
}

interface BinDetailsProduct {
  code?: string;
  name?: string;
}

export type {
  BinDetails,
  BinDetailsBank,
  BinDetailsCountry,
  BinDetailsProduct,
};

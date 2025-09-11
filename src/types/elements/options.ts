import { CreditCardType } from './cardTypes';
import { CoBadgedSupport } from './coBadgedSupport';
import { AutoCompleteValue, DataElementReference } from './shared';
import type {
  CopyButtonElementStyle,
  CopyIconStyles,
  ElementStyle,
} from './styles';

const ELEMENTS_TYPES = [
  'card',
  'cardExpirationDate',
  'cardNumber',
  'cardVerificationCode',
  'copyButton',
  'data',
  'text',
] as const;

type ElementType = typeof ELEMENTS_TYPES[number];

interface ElementInternalOptions {
  apiKey: string | undefined;
  customDomain: string | undefined;
  baseUrl: string;
  type: ElementType;
  debug: boolean | undefined;
  disableTelemetry: boolean | undefined;
  useNgApi: boolean | undefined;
  useSameOriginApi: boolean | undefined;
  useUat: boolean | undefined;
  useNetworkCheck: boolean | undefined;
}

enum InputMode {
  DECIMAL = 'decimal',
  EMAIL = 'email',
  NONE = 'none',
  NUMERIC = 'numeric',
  SEARCH = 'search',
  TEL = 'tel',
  TEXT = 'text',
  URL = 'url',
}

interface SanitizedElementOptions {
  ariaDescription?: string;
  ariaLabel?: string;
  autoComplete?: AutoCompleteValue;
  binLookup?: boolean;
  cardBrand?: string;
  cardTypes?: CreditCardType[];
  coBadgedSupport?: string;
  copyIconStyles?: CopyIconStyles;
  disabled?: boolean;
  enableCopy?: boolean;
  iconPosition?: string;
  inputMode?: `${InputMode}`;
  mask?: (RegExp | string)[];
  maxLength?: HTMLInputElement['maxLength'];
  password?: boolean;
  placeholder?: string;
  readOnly?: boolean;
  skipLuhnValidation?: boolean;
  style?: ElementStyle;
  targetId?: string;
  text?: string;
  title?: string;
  transform?: [RegExp, string] | null;
  validateOnChange?: boolean;
  validation?: RegExp;
  value?:
    | CardElementValue<'static'>
    | CardExpirationDateValue<'static'>
    | string;
}

type ElementOptions = ElementInternalOptions & SanitizedElementOptions;

type Transform = RegExp | [RegExp, string?] | null;

interface TransformOption {
  transform?: Transform;
}

interface AutoCompleteOption {
  autoComplete?: AutoCompleteValue;
}

interface CardAutoCompleteOption {
  autoComplete?: CardElementAutoComplete;
}

type CustomizableElementOptions = Pick<
  ElementOptions,
  | 'binLookup'
  | 'cardTypes'
  | 'copyIconStyles'
  | 'coBadgedSupport'
  | 'disabled'
  | 'enableCopy'
  | 'inputMode'
  | 'readOnly'
  | 'skipLuhnValidation'
  | 'style'
  | 'validateOnChange'
> &
  AutoCompleteOption;

type CardCustomizableElementOptions = Pick<
  ElementOptions,
  | 'binLookup'
  | 'cardTypes'
  | 'copyIconStyles'
  | 'disabled'
  | 'enableCopy'
  | 'inputMode'
  | 'readOnly'
  | 'skipLuhnValidation'
  | 'style'
  | 'validateOnChange'
> &
  CardAutoCompleteOption;

type ElementValueType = 'static' | 'reference';

interface CardElementValue<T extends ElementValueType> {
  cvc?: T extends 'reference' ? DataElementReference : string;
  expiration_month?: T extends 'reference' ? DataElementReference : number;
  expiration_year?: T extends 'reference' ? DataElementReference : number;
  number?: T extends 'reference' ? DataElementReference : string;
}

interface CardElementPlaceholder {
  cardNumber?: string;
  cardExpirationDate?: string;
  cardSecurityCode?: string;
}

interface CardExpirationDateValue<T extends ElementValueType> {
  month: T extends 'reference' ? DataElementReference : number;
  year: T extends 'reference' ? DataElementReference : number;
}

interface CardElementAutoComplete {
  number: AutoCompleteValue;
  expirationDate: AutoCompleteValue;
  csc: AutoCompleteValue;
}

type CreateCardElementOptions = CardCustomizableElementOptions &
  Pick<
    ElementOptions,
    'binLookup' | 'cardTypes' | 'skipLuhnValidation' | 'title'
  > & {
    coBadgedSupport?: CoBadgedSupport[];
    placeholder?: CardElementPlaceholder;
    value?: CardElementValue<'static'>;
  };

type UpdateCardElementOptions = Omit<
  CreateCardElementOptions,
  'validateOnChange' | 'enableCopy'
>;

type CreateTextElementOptions = CustomizableElementOptions &
  Pick<
    ElementOptions,
    'placeholder' | 'mask' | 'maxLength' | 'password' | 'validation' | 'title'
  > &
  TransformOption &
  Required<Pick<ElementOptions, 'targetId'>> & {
    'aria-label'?: string;
    value?: string;
  };

type UpdateTextElementOptions = Omit<
  CreateTextElementOptions,
  'targetId' | 'mask' | 'validateOnChange'
>;

type CreateCardNumberElementOptions = CustomizableElementOptions &
  Pick<
    ElementOptions,
    | 'binLookup'
    | 'placeholder'
    | 'iconPosition'
    | 'cardTypes'
    | 'skipLuhnValidation'
    | 'title'
  > &
  Required<Pick<ElementOptions, 'targetId'>> & {
    'aria-label'?: string;
    value?: string;
  };

type UpdateCardNumberElementOptions = Omit<
  CreateCardNumberElementOptions,
  'targetId' | 'validateOnChange' | 'enableCopy'
>;

type CreateCardExpirationDateElementOptions = CustomizableElementOptions &
  Pick<ElementOptions, 'title' | 'placeholder'> &
  Required<Pick<ElementOptions, 'targetId'>> & {
    'aria-label'?: string;
    value?: CardExpirationDateValue<'static'> | string;
  };

type UpdateCardExpirationDateElementOptions = Omit<
  CreateCardExpirationDateElementOptions,
  'targetId' | 'validateOnChange' | 'enableCopy'
>;

type CreateCardVerificationCodeElementOptions = CustomizableElementOptions &
  Pick<ElementOptions, 'placeholder' | 'title' | 'cardBrand'> &
  Required<Pick<ElementOptions, 'targetId'>> & {
    'aria-label'?: string;
    value?: string;
  };

type UpdateCardVerificationCodeElementOptions = Omit<
  CreateCardVerificationCodeElementOptions,
  'targetId' | 'validateOnChange' | 'enableCopy'
>;

type CreateCopyButtonElementOptions = Pick<
  ElementOptions,
  'targetId' | 'title' | 'disabled'
> & {
  id?: string;
  style?: CopyButtonElementStyle;
  text?: string;
};

type UpdateCopyButtonElementOptions = Omit<
  CreateCopyButtonElementOptions,
  'targetId'
>;

export type {
  CardCustomizableElementOptions,
  CardElementAutoComplete,
  CardElementPlaceholder,
  CardElementValue,
  CardExpirationDateValue,
  CreateCardElementOptions,
  CreateCardExpirationDateElementOptions,
  CreateCardNumberElementOptions,
  CreateCardVerificationCodeElementOptions,
  CreateCopyButtonElementOptions,
  CreateTextElementOptions,
  CustomizableElementOptions,
  ElementInternalOptions,
  ElementOptions,
  ElementType,
  InputMode,
  SanitizedElementOptions,
  Transform,
  UpdateCardElementOptions,
  UpdateCardExpirationDateElementOptions,
  UpdateCardNumberElementOptions,
  UpdateCardVerificationCodeElementOptions,
  UpdateCopyButtonElementOptions,
  UpdateTextElementOptions,
};

export { ELEMENTS_TYPES };

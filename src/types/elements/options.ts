import { CreditCardType } from './cardTypes';
import { AutoCompleteValue, DataElementReference } from './shared';
import type { CopyIconStyles, ElementStyle } from './styles';

const ELEMENTS_TYPES = [
  'card',
  'cardExpirationDate',
  'cardNumber',
  'cardVerificationCode',
  'data',
  'text',
] as const;

type ElementType = typeof ELEMENTS_TYPES[number];

interface ElementInternalOptions {
  apiKey: string | undefined;
  baseUrl: string;
  type: ElementType;
  useNgApi: boolean | undefined;
  useSameOriginApi: boolean | undefined;
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
  cardBrand?: string;
  cardTypes?: CreditCardType[];
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

type CustomizableElementOptions = Pick<
  ElementOptions,
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
  AutoCompleteOption;

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

type CreateCardElementOptions = CustomizableElementOptions &
  Pick<ElementOptions, 'cardTypes' | 'skipLuhnValidation'> & {
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
    'placeholder' | 'mask' | 'maxLength' | 'password' | 'validation'
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
    'placeholder' | 'iconPosition' | 'cardTypes' | 'skipLuhnValidation'
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
  Pick<ElementOptions, 'placeholder'> &
  Required<Pick<ElementOptions, 'targetId'>> & {
    'aria-label'?: string;
    value?: CardExpirationDateValue<'static'> | string;
  };

type UpdateCardExpirationDateElementOptions = Omit<
  CreateCardExpirationDateElementOptions,
  'targetId' | 'validateOnChange' | 'enableCopy'
>;

type CreateCardVerificationCodeElementOptions = CustomizableElementOptions &
  Pick<ElementOptions, 'placeholder' | 'cardBrand'> &
  Required<Pick<ElementOptions, 'targetId'>> & {
    'aria-label'?: string;
    value?: string;
  };

type UpdateCardVerificationCodeElementOptions = Omit<
  CreateCardVerificationCodeElementOptions,
  'targetId' | 'validateOnChange' | 'enableCopy'
>;

export type {
  CardElementPlaceholder,
  CardElementValue,
  CardExpirationDateValue,
  CreateCardElementOptions,
  CreateCardExpirationDateElementOptions,
  CreateCardNumberElementOptions,
  CreateCardVerificationCodeElementOptions,
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
  UpdateTextElementOptions,
};

export { ELEMENTS_TYPES };

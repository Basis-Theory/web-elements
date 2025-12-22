import type { HttpClient } from '../../types/sdk';
import { Device } from '../sdk/services/device';
import type {
  CardElementEvents,
  CardExpirationDateElementEvents,
  CardNumberElementEvents,
  CardVerificationCodeElementEvents,
  CopyButtonElementEvents,
  ElementEventListener,
  EventType,
  Subscription,
  TextElementEvents,
} from './events';
import type {
  CardElementValue,
  CardExpirationDateValue,
  CreateCardElementOptions,
  CreateCardExpirationDateElementOptions,
  CreateCardNumberElementOptions,
  CreateCardVerificationCodeElementOptions,
  CreateCopyButtonElementOptions,
  CreateTextElementOptions,
  UpdateCardElementOptions,
  UpdateCardExpirationDateElementOptions,
  UpdateCardNumberElementOptions,
  UpdateCardVerificationCodeElementOptions,
  UpdateCopyButtonElementOptions,
  UpdateTextElementOptions,
} from './options';
import type { Proxy, TokenIntents, Tokenize, Tokens } from './services';
import { Sessions } from './services/sessions';
import type {
  CardMetadata,
  DataElementReference,
  ElementMetadata,
} from './shared';

interface BaseElement<UpdateOptions, ElementEvents> {
  readonly mounted: boolean;
  readonly metadata: ElementMetadata;
  mount(selector: string): Promise<void>;
  mount(element: Element): Promise<void>;
  update(options: UpdateOptions): Promise<void>;
  validate(): void;
  clear(): void;
  focus(): void;
  blur(): void;
  unmount(): void;
  on<T extends EventType>(
    eventType: T,
    listener: ElementEventListener<ElementEvents, T>
  ): Subscription;
}

type CardElement = BaseElement<UpdateCardElementOptions, CardElementEvents> & {
  readonly cardMetadata?: CardMetadata;
  setValue(value: CardElementValue<'reference'>, validate?: boolean): void;
};

type TextElement = BaseElement<UpdateTextElementOptions, TextElementEvents> & {
  setValueRef(value: TextElement): void;
  setValue(value: DataElementReference, validate?: boolean): void;
};

type CardNumberElement = BaseElement<
  UpdateCardNumberElementOptions,
  CardNumberElementEvents
> & {
  readonly cardMetadata?: CardMetadata;
  setValueRef(value: CardNumberElement): void;
  setValue(value: DataElementReference, validate?: boolean): void;
};

type CardExpirationDateElement = BaseElement<
  UpdateCardExpirationDateElementOptions,
  CardExpirationDateElementEvents
> & {
  setValueRef(value: CardExpirationDateElement): void;
  setValue(
    value: CardExpirationDateValue<'reference'>,
    validate?: boolean
  ): void;
  month(): ElementWrapper<CardExpirationDateElement>;
  year(): ElementWrapper<CardExpirationDateElement>;
  format(dateFormat: string): ElementWrapper<CardExpirationDateElement>;
};

type CardVerificationCodeElement = BaseElement<
  UpdateCardVerificationCodeElementOptions,
  CardVerificationCodeElementEvents
> & {
  setValueRef(value: CardVerificationCodeElement): void;
  setValue(value: DataElementReference, validate?: boolean): void;
};

type CopyButtonElement = BaseElement<
  UpdateCopyButtonElementOptions,
  CopyButtonElementEvents
> & {
  setValueRef(
    value:
      | TextElement
      | CardNumberElement
      | CardExpirationDateElement
      | CardVerificationCodeElement
  ): void;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ElementWrapper<T extends BaseElement<any, any> = BaseElement<any, any>> = {
  element: T;
  method?: string;
  formattingOptions?: { format: string };
};

type ElementValue =
  | TextElement
  | CardElement
  | CardNumberElement
  | CardExpirationDateElement
  | CardVerificationCodeElement
  | CopyButtonElement
  | ElementWrapper;

interface BasisTheoryElements {
  tokens: Tokens;
  proxy: Proxy;
  sessions: Sessions;
  tokenIntents: TokenIntents;
  tokenize: Tokenize['tokenize'];
  client: HttpClient;
  device: Device;

  createElement(type: 'card', options?: CreateCardElementOptions): CardElement;
  createElement(type: 'text', options: CreateTextElementOptions): TextElement;
  createElement(
    type: 'cardNumber',
    options: CreateCardNumberElementOptions
  ): CardNumberElement;
  createElement(
    type: 'cardExpirationDate',
    options: CreateCardExpirationDateElementOptions
  ): CardExpirationDateElement;
  createElement(
    type: 'cardVerificationCode',
    options: CreateCardVerificationCodeElementOptions
  ): CardVerificationCodeElement;
  createElement(
    type: 'copyButton',
    options: CreateCopyButtonElementOptions
  ): CopyButtonElement;
}
interface BasisTheoryElementsInternal extends BasisTheoryElements {
  init: (
    apiKey: string | undefined,
    elementsBaseUrl: string,
    elementsUseNgApi: boolean | undefined,
    elementsUseSameOriginApi: boolean | undefined,
    disableTelemetry: boolean | undefined,
    debug: boolean | undefined,
    environment: string | undefined,
    useNetworkCheck: boolean | undefined,
    customDomain: string | undefined
  ) => Promise<BasisTheoryElements>;
  hasElement: (payload: unknown) => boolean;
}

declare global {
  interface Window {
    BasisTheoryElements?: BasisTheoryElementsInternal;
  }
}

export type {
  BaseElement,
  BasisTheoryElements,
  BasisTheoryElementsInternal,
  ElementValue,
  ElementWrapper,
  CardElement as ICardElement,
  CardExpirationDateElement as ICardExpirationDateElement,
  CardNumberElement as ICardNumberElement,
  CardVerificationCodeElement as ICardVerificationCodeElement,
  CopyButtonElement as ICopyButtonElement,
  TextElement as ITextElement,
};

import type { Brand, FieldError, ListenableKey, Targeted } from './shared';

type EventType =
  | 'ready'
  | 'change'
  | 'focus'
  | 'blur'
  | 'keydown'
  | 'click'
  | 'copy';

interface BaseEvent<T extends EventType> {
  type: T;
}

type ReadyEvent = BaseEvent<'ready'>;

type ChangeEvent = BaseEvent<'change'> & {
  empty: boolean;
  complete: boolean;
  valid?: boolean;
  maskSatisfied?: boolean;
  errors?: FieldError[];
};

type CardChangeEvent = ChangeEvent & {
  cardBrand: Brand;
  cardLast4?: string;
  cardBin?: string;
};

type InputFocusEvent = BaseEvent<'focus'> & Targeted;

type InputBlurEvent = BaseEvent<'blur'> & Targeted;

type InputKeydownEvent = BaseEvent<'keydown'> &
  Targeted & {
    key: ListenableKey;
  } & Pick<KeyboardEvent, 'altKey' | 'ctrlKey' | 'shiftKey' | 'metaKey'>;

type ClickEvent = BaseEvent<'click'> & Targeted;

type CopyEvent = BaseEvent<'copy'> & Targeted;

type BaseElementEvents =
  | ReadyEvent
  | InputFocusEvent
  | InputBlurEvent
  | InputKeydownEvent;

type TextElementEvents = BaseElementEvents | ChangeEvent;

type CardElementEvents = BaseElementEvents | CardChangeEvent | CopyEvent;

type CardNumberElementEvents = BaseElementEvents | CardChangeEvent | CopyEvent;

type CardExpirationDateElementEvents =
  | BaseElementEvents
  | ChangeEvent
  | CopyEvent;

type CardVerificationCodeElementEvents =
  | BaseElementEvents
  | ChangeEvent
  | CopyEvent;

type CopyButtonElementEvents = BaseElementEvents | ClickEvent | CopyEvent;

/**
 * Utility type that helps find a Union type based on a `type` property
 */
type FindByType<Union, Type> = Union extends { type: Type } ? Union : never;

type ElementEventListener<Events, Type> = (
  event: FindByType<Events, Type>
) => void;

interface Subscription {
  unsubscribe(): void;
}

export type {
  BaseElementEvents,
  BaseEvent,
  CardChangeEvent,
  CardElementEvents,
  CardExpirationDateElementEvents,
  CardNumberElementEvents,
  CardVerificationCodeElementEvents,
  ChangeEvent,
  ClickEvent,
  CopyButtonElementEvents,
  CopyEvent,
  ElementEventListener,
  EventType,
  InputBlurEvent,
  InputFocusEvent,
  InputKeydownEvent,
  ReadyEvent,
  Subscription,
  TextElementEvents,
};

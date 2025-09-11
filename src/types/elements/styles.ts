import type { Properties as CSSProperties } from 'csstype';

const SAFE_CSS_PROPERTIES = [
  'backgroundColor',
  'color',
  'fontFamily',
  'fontSize',
  'fontSmooth',
  'fontStyle',
  'fontVariant',
  'fontWeight',
  'letterSpacing',
  'lineHeight',
  'padding',
  'textAlign',
  'textDecoration',
  'textShadow',
  'textTransform',
] as const;

// Button-specific CSS properties for styling interactive buttons
const BUTTON_CSS_PROPERTIES = [
  'alignItems',
  'backgroundColor',
  'border',
  'borderBottom',
  'borderColor',
  'borderLeft',
  'borderRadius',
  'borderRight',
  'borderStyle',
  'borderTop',
  'borderWidth',
  'boxShadow',
  'color',
  'cursor',
  'display',
  'fontFamily',
  'fontSize',
  'fontWeight',
  'gap',
  'height',
  'justifyContent',
  'letterSpacing',
  'lineHeight',
  'margin',
  'maxHeight',
  'maxWidth',
  'minHeight',
  'minWidth',
  'opacity',
  'outline',
  'padding',
  'textAlign',
  'textTransform',
  'transform',
  'transition',
  'width',
] as const;

type SafeCSSProperty = typeof SAFE_CSS_PROPERTIES[number];
type ButtonCSSProperty = typeof BUTTON_CSS_PROPERTIES[number];

const SAFE_CSS_PROPERTIES_ALTERNATES: Partial<
  Record<SafeCSSProperty, string[]>
> = {
  fontSmooth: ['-webkit-font-smoothing', '-moz-osx-font-smoothing'],
};

const SAFE_CSS_PROPERTIES_WITH_ALTERNATES = Object.keys(
  SAFE_CSS_PROPERTIES_ALTERNATES
);

type SafeStyle = Pick<CSSProperties, SafeCSSProperty>;

const CARD_ELEMENT_STYLE_VARIANT_SELECTORS = [
  ':hover',
  ':focus',
  ':read-only',
  '::placeholder',
  '::selection',
  ':disabled',
] as const;

const BUTTON_ELEMENT_STYLE_VARIANT_SELECTORS = [
  ':hover',
  ':focus',
  ':active',
] as const;

type CardElementStyleVariantSelector =
  typeof CARD_ELEMENT_STYLE_VARIANT_SELECTORS[number];

type ButtonElementStyleVariantSelector =
  typeof BUTTON_ELEMENT_STYLE_VARIANT_SELECTORS[number];

type ButtonStyle = Pick<CSSProperties, ButtonCSSProperty>;

type CardElementStyleVariantStyle = SafeStyle &
  Partial<Record<CardElementStyleVariantSelector, SafeStyle>>;

type ButtonElementStyleVariantStyle = ButtonStyle &
  Partial<Record<ButtonElementStyleVariantSelector, ButtonStyle>>;

const CARD_ELEMENT_STYLE_VARIANTS = [
  'base',
  'container',
  'complete',
  'invalid',
  'empty',
] as const;

const CARD_ELEMENT_STYLE_FONTS_ATTR = 'fonts' as const;

type CardElementStyleVariant = typeof CARD_ELEMENT_STYLE_VARIANTS[number];

type CardElementStyleFontAttr = typeof CARD_ELEMENT_STYLE_FONTS_ATTR;

type FontSource = string; // this could turn into an object in the future, to specify the font face attrs individually
type FontSources = FontSource[];

type Fonts = Record<CardElementStyleFontAttr, FontSources>;

type CardElementStyle = Partial<
  Record<CardElementStyleVariant, CardElementStyleVariantStyle> & Fonts
>;

const BUTTON_ELEMENT_STYLE_VARIANTS = ['base', 'container'] as const;

type ButtonElementStyleVariant = typeof BUTTON_ELEMENT_STYLE_VARIANTS[number];

type ButtonElementStyle = Partial<
  Record<ButtonElementStyleVariant, ButtonElementStyleVariantStyle> & Fonts
>;

type CopyButtonElementStyle = ButtonElementStyle;

type ElementStyle = CardElementStyle | CopyButtonElementStyle; // add others here as union type

type CopyIconStyles = {
  size?: string;
  color?: string;
  successColor?: string;
};

export {
  BUTTON_CSS_PROPERTIES,
  BUTTON_ELEMENT_STYLE_VARIANT_SELECTORS,
  BUTTON_ELEMENT_STYLE_VARIANTS,
  CARD_ELEMENT_STYLE_FONTS_ATTR,
  CARD_ELEMENT_STYLE_VARIANT_SELECTORS,
  CARD_ELEMENT_STYLE_VARIANTS,
  SAFE_CSS_PROPERTIES,
  SAFE_CSS_PROPERTIES_ALTERNATES,
  SAFE_CSS_PROPERTIES_WITH_ALTERNATES,
};

export type {
  ButtonCSSProperty,
  ButtonElementStyle,
  ButtonElementStyleVariant,
  ButtonElementStyleVariantSelector,
  ButtonElementStyleVariantStyle,
  ButtonStyle,
  CardElementStyle,
  CardElementStyleVariant,
  CardElementStyleVariantSelector,
  CardElementStyleVariantStyle,
  CopyButtonElementStyle,
  CopyIconStyles,
  ElementStyle,
  Fonts,
  FontSources,
  SafeCSSProperty,
  SafeStyle,
};

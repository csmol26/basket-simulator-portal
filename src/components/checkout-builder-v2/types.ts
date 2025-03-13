
import { ComponentConfig } from "./ComponentPalette";

export interface DragItem {
  id: string;
  content: string;
  config?: {
    label?: string;
    placeholder?: string;
    ariaLabel?: string;
    spaceSmall?: string;
    displayMode?: "default" | "compact" | "expanded";
    validation?: {
      required?: boolean;
      customErrorMessage?: string;
    };
  };
  originalComponent: ComponentConfig;
}

export interface Row {
  id: string;
  components: DragItem[];
}

export interface APMItem {
  id: string;
  name: string;
  type: string;
}

export interface StyleVariables {
  primerColorBrand: string;
  primerTypographyBrand: string;
  primerColorBackground: string;
  primerRadiusBase: string;
  primerSpaceBase: string;
  primerSizeBase: string;
  primerColorLoader: string;
  primerColorFocus: string;
  primerSpaceSmall: string;
  [key: string]: string; // Add index signature to allow any string key
}

export interface CheckoutTheme {
  id: string;
  name: string;
  variables: Partial<StyleVariables>;
}

export type CardFormLayout = "single-line" | "two-line" | "three-line";

export type PaymentMethodDisplay = "dropdown" | "radio" | "buttons" | "tabs";

export interface CheckoutConfig {
  layout: "single-page" | "multi-step";
  cardFormLayout: CardFormLayout;
  paymentMethodsDisplay: PaymentMethodDisplay;
  showCardholderName: boolean;
}

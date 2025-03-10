
import { ComponentConfig } from "./ComponentList";

export interface DragItem {
  id: string;
  content: string;
  config?: {
    label?: string;
    placeholder?: string;
    ariaLabel?: string;
    spaceSmall?: string;
  };
  originalComponent: ComponentConfig;
}

export interface Row {
  id: string;
  components: DragItem[];
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
}

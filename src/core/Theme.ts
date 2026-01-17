export interface Colors {
  background: string;
  foreground: string;
  primary: string;
  secondary: string;
  accent: string;
}

export interface Typography {
  headingScale: number;
  bodySize: number;
}

export interface Spacing {
  base: number;
  small: number;
  large: number;
}

export interface Theme {
  colors: Colors;
  typography?: Typography;
  spacing?: Spacing;
}

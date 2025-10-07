// Extend JSX to recognize Google Maps custom elements
declare namespace JSX {
  interface IntrinsicElements {
    'gmp-map': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    'gmp-advanced-marker': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    'gmp-place-picker': React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement> & {
        'for-map': string;
        'class-name': string;
        value: string;
        placeholder: string;
        onGmpPlacechange?: (event: CustomEvent) => void;
      },
      HTMLElement
    >;
    'gmp-polygon': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    'gmp-polyline': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    'gmp-heatmap-layer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    'gmp-directions': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
  }
}

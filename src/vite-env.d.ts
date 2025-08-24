/// <reference types="vite/client" />

// Make React JSX types globally available
import 'react';

declare global {
    namespace JSX {
        // Re-export React's JSX types
        type Element = React.JSX.Element;
        type IntrinsicElements = React.JSX.IntrinsicElements;
    }
}

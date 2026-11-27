import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

// Schriften werden lokal mitgeliefert – keine externen Dienste nötig.
import '@fontsource-variable/inter-tight';
import '@fontsource/instrument-serif/400.css';
import '@fontsource/instrument-serif/400-italic.css';
import '@fontsource/ibm-plex-mono/400.css';
import '@fontsource/ibm-plex-mono/500.css';

import './styles/base.css';
import './styles/landing.css';
import './styles/demo.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);

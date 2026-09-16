import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { KnowledgeSpacePreview } from './knowledge-space-preview.tsx';
import './knowledge-space-preview.css';

const container = document.getElementById('knowledge-space-root');

if (!container) {
  throw new Error('Knowledge-space preview root is missing.');
}

createRoot(container).render(
  <StrictMode>
    <KnowledgeSpacePreview />
  </StrictMode>
);

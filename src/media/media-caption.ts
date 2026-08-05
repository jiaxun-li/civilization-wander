import { Fragment, createElement } from 'react';

export function MediaCaption({ text }: { readonly text: string }) {
  return createElement(Fragment, null, text);
}

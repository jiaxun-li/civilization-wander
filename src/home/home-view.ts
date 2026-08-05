import {
  Fragment,
  createElement,
  type MouseEvent as ReactMouseEvent,
  type ReactNode
} from 'react';
import { flushSync } from 'react-dom';
import { createRoot, type Root } from 'react-dom/client';
import type { CardId } from '../types/runtime.ts';

export interface HomeActionViewModel {
  readonly cardId: CardId;
  readonly href: string;
  readonly label: string;
}

export interface HomeCardViewModel {
  readonly cardId: CardId;
  readonly href: string;
  readonly entityType: string;
  readonly entityName: string;
  readonly summary: string;
  readonly cardTitle: string;
}

export interface HomeSectionViewModel {
  readonly eyebrow: string;
  readonly title: string;
  readonly cards: readonly HomeCardViewModel[];
}

export interface HomeViewModel {
  readonly primaryAction: HomeActionViewModel;
  readonly featuredActions: readonly HomeActionViewModel[];
  readonly sections: readonly HomeSectionViewModel[];
  readonly onOpenCard: (cardId: CardId, primary: boolean) => void;
}

export interface HomeViewController {
  updatePrimaryAction(action: HomeActionViewModel): void;
  unmount(): void;
}

function shouldHandleCardClick(event: ReactMouseEvent<HTMLAnchorElement>): boolean {
  return event.button === 0
    && !event.metaKey
    && !event.ctrlKey
    && !event.shiftKey
    && !event.altKey;
}

function actionLink(
  action: HomeActionViewModel,
  primary: boolean,
  onOpenCard: HomeViewModel['onOpenCard']
): ReactNode {
  return createElement(
    'a',
    {
      className: 'home-primary-action',
      href: action.href,
      key: primary ? 'primary' : action.cardId,
      'data-home-primary-action': primary ? '' : undefined,
      'data-start-card': action.cardId,
      onClick(event: ReactMouseEvent<HTMLAnchorElement>) {
        if (!shouldHandleCardClick(event)) return;
        event.preventDefault();
        onOpenCard(action.cardId, primary);
      }
    },
    action.label,
    ' ',
    createElement('span', { 'aria-hidden': 'true' }, '→')
  );
}

function homeCard(card: HomeCardViewModel, onOpenCard: HomeViewModel['onOpenCard']): ReactNode {
  return createElement(
    'a',
    {
      className: 'home-entity-card',
      href: card.href,
      key: card.cardId,
      'data-start-card': card.cardId,
      onClick(event: ReactMouseEvent<HTMLAnchorElement>) {
        if (!shouldHandleCardClick(event)) return;
        event.preventDefault();
        onOpenCard(card.cardId, false);
      }
    },
    createElement('span', null, card.entityType),
    createElement('strong', null, card.entityName),
    createElement('p', null, card.summary),
    createElement('small', null, card.cardTitle),
    createElement('b', { 'aria-hidden': 'true' }, '开始阅读 →')
  );
}

export function HomeView({
  primaryAction,
  featuredActions,
  sections,
  onOpenCard
}: HomeViewModel): ReactNode {
  return createElement(
    Fragment,
    null,
    createElement(
      'div',
      { className: 'home-hero' },
      createElement('p', { className: 'home-hero__eyebrow' }, '历史的线索'),
      createElement(
        'h1',
        { id: 'home-title', tabIndex: -1 },
        '从一个故事出发，走进彼此相连的历史。'
      ),
      createElement(
        'p',
        { className: 'home-hero__lead' },
        '一个人物、一座城市、一件器物或一部作品，都承载着具体的时代与生活。'
      ),
      createElement(
        'nav',
        { className: 'home-primary-actions', 'aria-label': '推荐阅读起点' },
        actionLink(primaryAction, true, onOpenCard),
        ...featuredActions.map(action => actionLink(action, false, onOpenCard))
      )
    ),
    createElement(
      'div',
      { id: 'home-sections', 'data-home-sections': '' },
      ...sections.map((section, index) => {
        const headingId = `home-section-${index + 1}-title`;
        return createElement(
          'section',
          {
            className: 'home-entities',
            'aria-labelledby': headingId,
            key: section.title
          },
          createElement(
            'header',
            null,
            createElement('p', { className: 'home-hero__eyebrow' }, section.eyebrow),
            createElement('h2', { id: headingId }, section.title)
          ),
          createElement(
            'div',
            { className: 'home-card-grid' },
            ...section.cards.map(card => homeCard(card, onOpenCard))
          )
        );
      })
    )
  );
}

export function mountHomeView(
  container: HTMLElement,
  initialModel: HomeViewModel
): HomeViewController {
  const reactRoot: Root = createRoot(container);
  let model = initialModel;

  function render(): void {
    flushSync(() => reactRoot.render(createElement(HomeView, model)));
  }

  render();

  return Object.freeze({
    updatePrimaryAction(action: HomeActionViewModel): void {
      model = { ...model, primaryAction: action };
      render();
    },
    unmount(): void {
      reactRoot.unmount();
    }
  });
}

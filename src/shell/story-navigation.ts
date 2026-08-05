import { Fragment, createElement } from 'react';
import { flushSync } from 'react-dom';
import { createRoot } from 'react-dom/client';

export interface StoryNavigationViewModel {
  readonly visible: boolean;
  readonly returnsToStory: boolean;
  readonly trailNames: readonly string[];
}

export interface StoryNavigationController {
  update(model: StoryNavigationViewModel): void;
}

interface StoryNavigationProps extends StoryNavigationViewModel {
  readonly onBack: () => void;
}

export function StoryNavigation({
  returnsToStory,
  trailNames,
  onBack
}: StoryNavigationProps) {
  const desktopLabel = returnsToStory ? '返回上一个故事' : '返回首页';
  const mobileLabel = returnsToStory ? '返回' : '返回首页';
  const trailText = trailNames.join(' → ');

  return createElement(
    Fragment,
    null,
    createElement(
      'button',
      {
        className: 'story-back',
        type: 'button',
        'data-story-back': '',
        'data-back-mode': returnsToStory ? 'story' : 'home',
        'aria-label': desktopLabel,
        onClick: onBack
      },
      createElement('span', { 'aria-hidden': 'true' }, '←'),
      createElement('span', { className: 'story-back__desktop', 'data-story-back-desktop': '' }, desktopLabel),
      createElement('span', { className: 'story-back__mobile', 'data-story-back-mobile': '' }, mobileLabel)
    ),
    createElement(
      'p',
      {
        className: 'story-trail',
        'data-story-trail': '',
        hidden: trailNames.length < 2,
        'aria-label': '漫游足迹',
        title: trailText
      },
      trailText
    )
  );
}

export function mountStoryNavigation(
  container: HTMLElement,
  initialModel: StoryNavigationViewModel,
  onBack: () => void
): StoryNavigationController {
  const reactRoot = createRoot(container);
  let model = initialModel;

  function render(): void {
    container.hidden = !model.visible;
    flushSync(() => reactRoot.render(createElement(StoryNavigation, { ...model, onBack })));
  }

  render();

  return Object.freeze({
    update(nextModel: StoryNavigationViewModel): void {
      model = nextModel;
      render();
    }
  });
}

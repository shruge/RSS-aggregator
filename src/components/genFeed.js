import genCard from './card.js';
import { genLi, genList } from './uiElements.js';

export default (feed, t) => {
  const feedContainer = document.querySelector('.feeds');
  const feedCard = genCard(t('mainContent.feedTitle'));
  const list = genList();

  feed.forEach((feedItem) => {
    const title = document.createElement('h3');
    const descr = document.createElement('p');
    const item = genLi();

    title.classList.add('h6', 'm-0');
    title.textContent = feedItem.title;

    descr.textContent = feedItem.descr;
    descr.classList.add('m-0', 'small', 'text-black-50');

    item.append(title, descr);
    list.prepend(item);
  });

  feedCard.append(list);

  feedContainer.innerHTML = '';
  feedContainer.append(feedCard);
};

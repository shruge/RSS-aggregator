import genCard from './card.js';
import { genBtn, genLi, genList } from './uiElements.js';

export default (posts, t) => {
  const postsContainer = document.querySelector('.posts');
  const postsCard = genCard(t('mainContent.postsTitle'));
  const list = genList();

  posts.forEach((post) => {
    const link = document.createElement('a');
    const btn = genBtn(t('mainContent.button'));
    const item = genLi();

    btn.classList.add('btn-outline-primary', 'btn-sm');

    link.textContent = post.title;
    link.classList.add('fw-bold');
    link.setAttribute('href', post.link);
    link.setAttribute('data-id', post.id);
    link.setAttribute('target', '_blank');
    link.setAttribute('rel', 'noopener noreferrer');

    item.classList.add('d-flex', 'justify-content-between', 'align-items-start');
    item.append(link, btn);

    list.append(item);
  });

  postsCard.append(list);

  postsContainer.innerHTML = '';
  postsContainer.append(postsCard);
};

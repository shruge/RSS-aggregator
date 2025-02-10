import genCard from './card.js';
import { genBtn, genLi, genList } from './uiElements.js';

const createPostLink = (id, title, link) => {
  const linkEl = document.createElement('a');

  linkEl.textContent = title;
  linkEl.classList.add('fw-bold');
  linkEl.setAttribute('href', link);
  linkEl.setAttribute('data-id', id);
  linkEl.setAttribute('target', '_blank');
  linkEl.setAttribute('rel', 'noopener noreferrer');

  return linkEl;
};

const createPostBtn = (id, text) => {
  const btn = genBtn(text);

  btn.setAttribute('data-id', id);
  btn.setAttribute('data-bs-toggle', 'modal');
  btn.setAttribute('data-bs-target', '#modal');
  btn.classList.add('btn-outline-primary', 'btn-sm');

  return btn;
};

const genPosts = (state, t) => {
  const list = genList();
  const postsCard = genCard(t('mainContent.postsTitle'));
  const postsContainer = document.querySelector('.posts');

  state.posts.forEach((post) => {
    const { id, title, link } = post;
    const linkEl = createPostLink(id, title, link);
    const btn = createPostBtn(id, t('mainContent.button'));
    const item = genLi();

    item.classList.add('d-flex', 'justify-content-between', 'align-items-start');
    item.append(linkEl, btn);

    list.append(item);
  });

  postsCard.append(list);

  postsContainer.innerHTML = '';
  postsContainer.append(postsCard);
};

export default genPosts;

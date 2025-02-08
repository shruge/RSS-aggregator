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

const genPosts = (genStateWatcher, state, t) => {
  const { posts, modal } = state;
  const list = genList();
  const stateWatcher = genStateWatcher(state, t);
  const postsCard = genCard(t('mainContent.postsTitle'));
  const postsContainer = document.querySelector('.posts');

  posts.forEach((post) => {
    const {
      id, title, descr, link,
    } = post;
    const linkEl = createPostLink(id, title, link);
    const btn = createPostBtn(id, t('mainContent.button'));
    const item = genLi();

    linkEl.addEventListener('click', () => {
      stateWatcher.visitedPostsId.push(id);
    });

    btn.addEventListener('click', () => {
      const text = descr.replace(/<(\/?[^>]+)>/g, '');

      modal.descr = text;
      modal.title = title;
      stateWatcher.modal.link = link;
      stateWatcher.visitedPostsId.push(btn.dataset.id);
    });

    item.classList.add('d-flex', 'justify-content-between', 'align-items-start');
    item.append(linkEl, btn);

    list.append(item);
  });

  postsCard.append(list);

  postsContainer.innerHTML = '';
  postsContainer.append(postsCard);
};

export default genPosts;

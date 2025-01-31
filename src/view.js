import onChange from 'on-change';

const genBtn = (text) => {
  const btn = document.createElement('button');

  btn.textContent = text;
  btn.classList.add('btn');

  return btn;
};
const genList = () => {
  const list = document.createElement('ul');

  list.classList.add('list-group', 'border-0', 'rounded-0');

  return list;
};
const genLi = () => {
  const li = document.createElement('li');

  li.classList.add('list-group-item', 'border-0', 'border-end-0');

  return li;
};
const changeFormState = (state) => {
  const btn = document.querySelector('.rss-form button');
  const input = document.querySelector('input[name="url"]');

  if (state.formState === 'sending') {
    btn.setAttribute('disabled', true);
    input.setAttribute('readonly', true);
  } else {
    if (!state.error.length) input.value = '';

    btn.removeAttribute('disabled');
    input.removeAttribute('readonly');
  }
};
const displayFeedback = (text) => {
  const feedbackEl = document.querySelector('.feedback');

  if (text.length) {
    if (!feedbackEl.classList.contains('text-danger')) {
      feedbackEl.classList.remove('text-success');
      feedbackEl.classList.add('text-danger');
    }

    feedbackEl.textContent = text;
  } else {
    if (!feedbackEl.classList.contains('text-success')) {
      feedbackEl.classList.remove('text-danger');
      feedbackEl.classList.add('text-success');
    }

    feedbackEl.textContent = 'RSS успешно загружен';
  }
};
const genCard = (title) => {
  const card = document.createElement('div');
  const cardBody = document.createElement('div');
  const cardTitle = document.createElement('h2');

  card.classList.add('card', 'border-0');
  cardBody.classList.add('card-body');

  cardTitle.classList.add('card-title', 'h4');
  cardTitle.textContent = title;

  cardBody.append(cardTitle);
  card.append(cardBody);

  return card;
};
const genPosts = (posts) => {
  const postsContainer = document.querySelector('.posts');
  const postsCard = genCard('Посты');
  const list = genList();

  posts.forEach((post) => {
    const link = document.createElement('a');
    const btn = genBtn('Просмотр');
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
const genFeed = (feed) => {
  const feedContainer = document.querySelector('.feeds');
  const feedCard = genCard('Фиды');
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

  displayFeedback('');
};

const genStateWatcher = (state) => {
  const stateWatcher = onChange(state, (path) => {
    switch (path) {
      case 'posts':
        genPosts(state.posts);
        break;
      case 'feed':
        genFeed(state.feed);
        break;
      case 'error':
        displayFeedback(state.error);
        break;
      case 'formState':
        changeFormState(state);
        break;
      default: break;
    }
  });

  return stateWatcher;
};

export default genStateWatcher;

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
const updateFeedback = (text, errorType, btn, input, feedbackEl) => {
  btn.removeAttribute('disabled');
  
  input.removeAttribute('readonly');
  input.classList.toggle('is-invalid', errorType === 'invalid');

  feedbackEl.textContent = text;
  feedbackEl.classList.toggle('text-danger', errorType !== 'noError');
  feedbackEl.classList.toggle('text-success', errorType === 'noError');
}
const changeFormState = (formState, t) => {
  const input = document.querySelector('#url-input');
  const btn = document.querySelector('.rss-form button');
  const feedbackEl = document.querySelector('.feedback');
  
  switch(formState) {
    case 'sending':
      feedbackEl.textContent = '';

      btn.setAttribute('disabled', true);
    
      input.setAttribute('readonly', true);
      input.classList.remove('is-invalid');
      break;
    case 'invalid':
      updateFeedback(t('errors.invalid'), 'invalid', btn, input, feedbackEl);
      break;
    case 'success':
      input.value = '';

      updateFeedback(t('errors.success'), 'noError', btn, input, feedbackEl);
      break;
    case 'networkError':
      updateFeedback(t('errors.network'), 'error', btn, input, feedbackEl);
      break;
    case 'noRss':
      updateFeedback(t('errors.noRss'), 'error', btn, input, feedbackEl);
      break;
    case 'alreadyExist':
      updateFeedback(t('errors.alreadyExist'), 'error', btn, input, feedbackEl);
      break;
    default:
      throw new Error(`Invalid formState: ${formState}`);
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
const genPosts = (posts, t) => {
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
const genFeed = (feed, t) => {
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

const genStateWatcher = (state, t) => {
  const stateWatcher = onChange(state, (path) => {
    switch (path) {
      case 'posts':
        genPosts(state.posts, t);
        break;
      case 'feed':
        genFeed(state.feed, t);
        break;
      case 'formState':
        changeFormState(state.formState, t);
        break;
      default: break;
    }
  });

  return stateWatcher;
};

export default genStateWatcher;

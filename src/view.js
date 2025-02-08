import onChange from 'on-change';
import genFeed from './components/genFeed.js';
import genPosts from './components/genPosts.js';

const markPost = (psotIds) => {
  psotIds.forEach((id) => {
    const linkEl = document.querySelector(`a[data-id='${id}']`);

    linkEl.classList.remove('fw-bold');
    linkEl.classList.add('fw-normal', 'link-secondary');
  });
};

const updateModal = ({ title, descr, link }) => {
  document.querySelector('.full-article').setAttribute('href', link);
  document.querySelector('.modal-title').textContent = title;
  document.querySelector('.modal-body').textContent = descr;
};

const updateFeedback = (btn, input, feedbackEl, errorType = 'error') => {
  btn.removeAttribute('disabled');

  input.removeAttribute('readonly');
  input.classList.toggle('is-invalid', errorType === 'invalid');

  feedbackEl.classList.toggle('text-danger', errorType !== 'noError');
  feedbackEl.classList.toggle('text-success', errorType === 'noError');
};

const changeFormState = (formState, t) => {
  const input = document.querySelector('#url-input');
  const btn = document.querySelector('.rss-form button');
  const feedbackEl = document.querySelector('.feedback');

  if (formState !== 'sending') feedbackEl.textContent = t(`errors.${formState}`);

  switch (formState) {
    case 'sending':
      feedbackEl.textContent = '';

      btn.setAttribute('disabled', true);

      input.setAttribute('readonly', true);
      input.classList.remove('is-invalid');
      break;
    case 'invalid':
      updateFeedback(btn, input, feedbackEl, 'invalid');
      break;
    case 'success':
      input.value = '';

      updateFeedback(btn, input, feedbackEl, 'noError');
      break;
    default:
      updateFeedback(btn, input, feedbackEl);
      break;
  }
};

const genStateWatcher = (state, t) => {
  const stateWatcher = onChange(state, (path) => {
    switch (path) {
      case 'visitedPostsId':
        markPost(state.visitedPostsId);
        break;
      case 'modal.link':
        updateModal(state.modal);
        break;
      case 'posts':
        genPosts(genStateWatcher, state, t);
        markPost(state.visitedPostsId);
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

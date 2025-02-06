import onChange from 'on-change';
import genFeed from './components/feed.js';
import genPosts from './components/posts.js';

const updateFeedback = (errorType, btn, input, feedbackEl) => {
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

  switch (formState) {
    case 'sending':
      feedbackEl.textContent = '';

      btn.setAttribute('disabled', true);

      input.setAttribute('readonly', true);
      input.classList.remove('is-invalid');
      break;
    case 'invalid':
      feedbackEl.textContent = t('errors.invalid');

      updateFeedback('invalid', btn, input, feedbackEl);
      break;
    case 'success':
      input.value = '';
      feedbackEl.textContent = t('errors.success');

      updateFeedback('noError', btn, input, feedbackEl);
      break;
    case 'networkError':
      feedbackEl.textContent = t('errors.network');

      updateFeedback('error', btn, input, feedbackEl);
      break;
    case 'noRss':
      feedbackEl.textContent = t('errors.noRss');

      updateFeedback('error', btn, input, feedbackEl);
      break;
    case 'alreadyExist':
      feedbackEl.textContent = t('errors.alreadyExist');

      updateFeedback('error', btn, input, feedbackEl);
      break;
    default:
      throw new Error(`Invalid formState: ${formState}`);
  }
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

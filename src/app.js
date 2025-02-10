import * as yup from 'yup';
import genStateWatcher from './view.js';
import { setPostHandlers } from './utils/helpers.js';
import {
  checkForXmlData, getData, parse, updatePosts,
} from './utils/asyncHelpers.js';

yup.setLocale({
  mixed: {
    required: 'empty',
    notOneOf: 'alreadyExist',
  },
  string: {
    url: 'invalid',
  },
});

const app = (t) => {
  const state = {
    formState: 'filling',
    feed: [],
    links: [],
    posts: [],
    visitedPostsId: [],
    modal: {
      link: '',
      title: '',
      descr: '',
    },
  };
  const stateWatcher = genStateWatcher(state, t);
  const form = document.querySelector('form');

  const updateState = (link, data) => {
    const { feed, posts } = parse(data);

    state.links.push(link);
    stateWatcher.feed.push(feed);
    stateWatcher.formState = 'success';
    stateWatcher.posts = posts.concat(stateWatcher.posts);

    setPostHandlers(stateWatcher);
  };

  const getDataContents = (link) => {
    getData(link).then((data) => {
      const contents = checkForXmlData(data);

      if (contents) updateState(link, contents);
    })
      .catch((err) => {
        console.error(t(`errors.${err.message}`));
        stateWatcher.formState = err.message;
      });
  };

  const checkLinkAndFetch = (link) => {
    const linkScheme = yup.string().url().required().notOneOf(state.links);

    stateWatcher.formState = 'sending';

    linkScheme.validate(link)
      .then(() => {
        getDataContents(link);
      })
      .catch((err) => {
        stateWatcher.formState = err.message;
      });
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(form);

    checkLinkAndFetch(formData.get('url'));
  });

  updatePosts(stateWatcher, t);
};

export default app;

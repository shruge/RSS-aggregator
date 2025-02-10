import * as yup from 'yup';
import genStateWatcher from './view.js';
import { setPostHandler } from './utils/helpers.js';
import {
  getData, parse, updatePosts,
} from './utils/asyncHelpers.js';

const app = (t) => {
  yup.setLocale({
    mixed: {
      required: 'empty',
      notOneOf: 'alreadyExist',
    },
    string: {
      url: 'invalid',
    },
  });

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

  const updateState = (link, parsedData) => {
    const { feed, posts } = parsedData;

    state.links.push(link);
    stateWatcher.feed.push(feed);
    stateWatcher.formState = 'success';
    stateWatcher.posts = posts.concat(stateWatcher.posts);
  };

  const getDataContents = (link) => {
    getData(link).then((data) => {
      const parseData = parse(data);

      if (parseData) updateState(link, parseData);
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

  updatePosts(genStateWatcher, state, t);
  setPostHandler(stateWatcher);
};

export default app;

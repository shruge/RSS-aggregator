import * as yup from 'yup';
import genStateWatcher from './view.js';
import {
  getData, getFeedItem, getPosts, parse,
} from './helpers.js';

const app = (t) => {
  yup.setLocale({
    mixed: {
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
  };
  const form = document.querySelector('form');
  // const title = document.querySelector('h1');
  // const input = document.querySelector('#url-input');
  // const descr = document.querySelector('h1 + .lead');
  // const rssExample = document.querySelector('.text-muted');
  // const label = document.querySelector('label[for="url-input"]');
  // const addBtn = document.querySelector('button[type="submit"]');

  // const renderText = () => {
  //   title.textContent = t('form.title');
  //   descr.textContent = t('form.descr');
  //   addBtn.textContent = t('form.button');
  //   label.textContent = t('form.placeholder');
  //   rssExample.textContent = t('form.example');
  //   input.setAttribute('placeholder', t('form.placeholder'));
  // }
  const updateState = (link, data) => {
    const xmlDoc = parse(data);
    const stateWatcher = genStateWatcher(state, t);
    const feedItem = getFeedItem(xmlDoc);

    //   if (findFeed(state.feed, feedItem) === -1) {
    const posts = getPosts(xmlDoc);

    state.links.push(link);
    stateWatcher.feed.push(feedItem);
    stateWatcher.posts = posts.map((post) => post);
    //   } else stateWatcher.formState = 'alreadyExist';

    stateWatcher.formState = 'success';
  };
  const getDataContents = (link) => {
    const stateWatcher = genStateWatcher(state, t);

    getData(link)
      .then((data) => {
        console.log(data);
        const { content_type: contentType } = data.status;

        if (data.contents && contentType && contentType.includes('xml')) {
          updateState(link, data.contents);
        } else stateWatcher.formState = 'noRss';
      })
      .catch(() => {
        stateWatcher.formState = 'networkError';
      });
  };
  const validateLink = (link) => {
    const stateWatcher = genStateWatcher(state, t);

    stateWatcher.formState = 'sending';

    const linkScheme = yup.string()
      .url().required()
      .notOneOf(state.links);

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

    validateLink(formData.get('url'));
  });
};

export default app;

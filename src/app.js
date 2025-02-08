import * as yup from 'yup';
import genStateWatcher from './view.js';
import {
  checkForXmlData,
  findNewPosts,
  getData, parse,
} from './helpers.js';

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
  const form = document.querySelector('form');

  const updatePosts = () => {
    const stateWatcher = genStateWatcher(state, t);
    const { links } = stateWatcher;
    const promises = links.map((link) => (
      getData(link).then((res) => res).catch((err) => {
        const errObj = {
          status: 'сеть не надежна',
          msg: err.message,
        };

        console.error(errObj.msg);
        return errObj;
      })
    ));

    Promise.all(promises).then((res) => {
      res.forEach((data) => {
        const content = checkForXmlData(data);

        if (content) {
          const { posts } = parse(content);
          const newPosts = findNewPosts(stateWatcher.posts, posts);

          if (newPosts.length) stateWatcher.posts = newPosts.concat(stateWatcher.posts);
        }
      });
    })
      .finally(() => {
        setTimeout(() => {
          updatePosts();
        }, 5000);
      });
  };

  const updateState = (link, data) => {
    const { feed, posts } = parse(data);
    const stateWatcher = genStateWatcher(state, t);

    state.links.push(link);
    stateWatcher.feed.push(feed);
    stateWatcher.formState = 'success';
    stateWatcher.posts = posts.concat(stateWatcher.posts);

    if (state.links.length === 1) {
      setTimeout(() => {
        updatePosts();
      }, 5000);
    }
  };

  const getDataContents = (link) => {
    const stateWatcher = genStateWatcher(state, t);

    getData(link).then((data) => {
      const contents = checkForXmlData(data);

      if (contents) updateState(link, contents);
      else stateWatcher.formState = 'noRss';
    })
      .catch((err) => {
        console.log(err);
        stateWatcher.formState = 'networkError';
      });
  };

  const validateLink = (link) => {
    const stateWatcher = genStateWatcher(state, t);
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

    validateLink(formData.get('url'));
  });
};

export default app;

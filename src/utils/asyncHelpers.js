import axios from 'axios';
import {
  findNewPosts, getFeed, getPosts,
} from './helpers.js';

export const parse = (data) => {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(data.contents, 'application/xml');
  const parseError = xmlDoc.querySelector('parsererror');

  if (!parseError) {
    const posts = getPosts(xmlDoc);
    const feed = getFeed(xmlDoc);

    return { feed, posts };
  }

  throw new Error('noRss');
};

export const getData = (link) => {
  const errorTimeout = new Promise((_, rej) => {
    setTimeout(() => rej(new Error('networkError')), 10000);
  });

  return Promise.race([
    axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(link)}`)
      .then((res) => {
        if (res.status >= 200 && res.status < 300) { return res.data; }
        throw new Error('noResponse');
      }).catch(() => {
        throw new Error('networkError');
      }),
    errorTimeout,
  ]);
};

export const updatePosts = (genState, state, t) => {
  const stateWatcher = genState(state, t);
  const { links, posts: prevPosts } = stateWatcher;
  const postsUpdateDelay = 5000;
  const promises = links.map((link) => (
    getData(link).then((res) => res).catch((err) => {
      const errObj = {
        status: 'сеть не надежна',
        msg: err.message,
      };

      console.error(t(`errors.${errObj.msg}`));
      return errObj;
    })
  ));

  Promise.all(promises).then((res) => {
    res.forEach((data) => {
      const { posts: newPostsParse } = parse(data);
      const newPosts = findNewPosts(prevPosts, newPostsParse);

      if (newPosts.length) stateWatcher.posts = newPosts.concat(prevPosts);
    });
  }).catch((err) => {
    console.error(t(`errors.${err.message}`));
  }).finally(() => {
    setTimeout(() => {
      updatePosts(genState, state, t);
    }, postsUpdateDelay);
  });
};

import axios from 'axios';
import {
  findNewPosts, getFeed, getPosts, setPostHandlers,
} from './helpers.js';

export const parse = (rssData) => {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(rssData, 'application/xml');
  const posts = getPosts(xmlDoc);
  const feed = getFeed(xmlDoc);

  return { feed, posts };
};

export const checkForXmlData = (data) => {
  const { content_type: contentType } = data.status || {};

  if (data.contents && contentType && contentType.includes('xml')) {
    return data.contents;
  }
  console.log(data);
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
      }),
    errorTimeout,
  ]);
};

export const updatePosts = (stateWatcher, t) => {
  const state = stateWatcher;
  const { links, posts: prevPosts } = state;
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
      const content = checkForXmlData(data);

      if (content) {
        const { posts: newPostsParse } = parse(content);
        const newPosts = findNewPosts(prevPosts, newPostsParse);

        if (newPosts.length) {
          state.posts = newPosts.concat(prevPosts);

          setPostHandlers(state);
        }
      }
    });
  }).catch((err) => {
    console.error(t(`errors.${err.message}`));
  }).finally(() => {
    setTimeout(() => {
      updatePosts(state, t);
    }, postsUpdateDelay);
  });
};

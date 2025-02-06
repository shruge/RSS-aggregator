import axios from 'axios';

const getTextContent = (node) => node.textContent.trim();

export const findFeed = (feeds, targetFeed) => (
  feeds.findIndex(({ title }) => title === targetFeed.title)
);
export const findNewPosts = (prevPosts, newPosts) => (
  newPosts.filter(({ link: newPostLink }) => (
    !prevPosts.some(({ link: prevPostLink }) => (
      newPostLink === prevPostLink
    ))
  ))
);
export const checkForXmlData = (data) => {
  const { content_type: contentType } = data.status || {};

  if (data.contents && contentType && contentType.includes('xml')) return data.contents;

  return null;
};
export const getData = (link) => {
  const errorTimeout = new Promise((_, rej) => {
    setTimeout(() => rej(new Error('Ошибка сети')), 10000);
  });

  return Promise.race([
    axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(link)}`)
      .then((res) => {
        if (res.status >= 200 && res.status < 300) { return res.data; }
        throw new Error('Не удалось получить ответ');
      }),
    errorTimeout,
  ]);
};
export const getFeed = (xmlDoc) => ({
  title: getTextContent(xmlDoc.querySelector('title')),
  descr: getTextContent(xmlDoc.querySelector('description')),
});
export const getPosts = (xmlDoc) => {
  const posts = [];

  xmlDoc.querySelectorAll('channel > item').forEach((post) => {
    const postObj = Array.from(post.childNodes).reduce((acc, postItem) => {
      switch (postItem.nodeName) {
        case 'title':
          acc.title = getTextContent(postItem);
          acc.id = crypto.randomUUID().slice(0, 5);
          break;
        case 'link':
          acc.link = getTextContent(postItem);
          break;
        case 'description':
          acc.descr = getTextContent(postItem);
          break;
        default: break;
      }

      return acc;
    }, {});

    posts.push(postObj);
  });

  return posts;
};
export const parse = (rssData) => {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(rssData, 'application/xml');
  const posts = getPosts(xmlDoc);
  const feed = getFeed(xmlDoc);

  return { feed, posts };
};

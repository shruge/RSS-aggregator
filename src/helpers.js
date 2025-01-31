const getTextContent = (node) => node.textContent.trim();

// export const findFeed = (feeds, targetFeed) => (
//   feeds.findIndex(({ title }) => title === targetFeed.title)
// );
export const parse = (rssData) => {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(rssData, 'application/xml');

  return xmlDoc;
};
export const getFeedItem = (xmlDoc) => ({
  title: getTextContent(xmlDoc.querySelector('title')),
  descr: getTextContent(xmlDoc.querySelector('description')),
});
export const getData = (link) => {
  const errorTimeout = new Promise((_, rej) => {
    setTimeout(() => rej(new Error('Ошибка сети')), 10000);
  });

  return Promise.race([
    fetch(`https://allorigins.hexlet.app/get?url=${encodeURIComponent(link)}`)
      .then((res) => {
        if (res.ok) { return res.json(); }
        throw new Error('Ошибка сети');
      }),
    errorTimeout,
  ]);
};
export const getPosts = (xmlDoc) => {
  const posts = [];

  xmlDoc.querySelectorAll('channel > item').forEach((post) => {
    const postObj = Array.from(post.childNodes).reduce((acc, postItem) => {
      switch (postItem.nodeName) {
        case 'title':
          acc.title = getTextContent(postItem);
          acc.id = new Date().getMilliseconds();
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

const getTextContent = (node) => node.textContent.trim();

export const findNewPosts = (prevPosts, newPosts) => (
  newPosts.filter(({ link: newPostLink }) => (
    !prevPosts.some(({ link: prevPostLink }) => (
      newPostLink === prevPostLink
    ))
  ))
);

export const getFeed = (xmlDoc) => ({
  title: getTextContent(xmlDoc.querySelector('title')),
  descr: getTextContent(xmlDoc.querySelector('description')),
});

export const updateFeedback = (btn, input, feedbackEl, errorType = 'error') => {
  btn.removeAttribute('disabled');

  input.removeAttribute('readonly');
  input.classList.toggle('is-invalid', errorType === 'invalid');

  feedbackEl.classList.toggle('text-danger', errorType !== 'noError');
  feedbackEl.classList.toggle('text-success', errorType === 'noError');
};

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

export const setPostHandlers = (stateWatcher) => {
  const { posts, modal, visitedPostsId } = stateWatcher;

  posts.forEach(({
    id, title, descr, link,
  }) => {
    const btnEl = document.querySelector(`button[data-id="${id}"]`);
    const linkEl = document.querySelector(`a[data-id="${id}"]`);

    linkEl.addEventListener('click', () => {
      visitedPostsId.push(id);
    });
    btnEl.addEventListener('click', () => {
      const text = descr.replace(/<(\/?[^>]+)>/g, '');

      modal.descr = text;
      modal.title = title;
      modal.link = link;
      visitedPostsId.push(id);
    });
  });
};

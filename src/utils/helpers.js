const getTextContent = (node) => node.textContent.trim();

const findPost = (findId, posts) => posts.find(({ id }) => findId === id);

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

export const setPostHandler = (stateWatcher) => {
  document.querySelector('.posts').addEventListener('click', (e) => {
    const { posts, modal, visitedPostsId } = stateWatcher;
    const elem = e.target;
    const { id } = elem.dataset;
    const clickedPost = findPost(id, posts);

    if (clickedPost) {
      const { title, descr, link } = clickedPost;
      const text = descr.replace(/<(\/?[^>]+)>/g, '');

      switch (elem.nodeName) {
        case 'A':
          visitedPostsId.push(id);
          break;
        case 'BUTTON':
          modal.descr = text;
          modal.title = title;
          modal.link = link;
          visitedPostsId.push(id);
          break;
        default: break;
      }
    }
  });
};

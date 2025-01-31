import './styles.scss';
import 'bootstrap';
import * as yup from 'yup';
import genStateWatcher from './view.js';
import {
  getData, getFeedItem, getPosts, parse,
} from './helpers.js';

const state = {
  formState: 'filling',
  feed: [],
  links: [],
  posts: [],
  error: '',
  visitedPostsId: [],
};
const form = document.querySelector('form');

const updateState = (link, data) => {
  const xmlDoc = parse(data);
  const stateWatcher = genStateWatcher(state);
  const feedItem = getFeedItem(xmlDoc);

  //   if (findFeed(state.feed, feedItem) === -1) {
  const posts = getPosts(xmlDoc);

  state.links.push(link);
  stateWatcher.feed.push(feedItem);
  stateWatcher.posts = posts.map((post) => post);
  //   } else stateWatcher.error = 'RSS уже существует';

  stateWatcher.formState = 'filling';
};
const getDataContents = (link) => {
  const stateWatcher = genStateWatcher(state);

  getData(link)
    .then((data) => {
      console.log(data);
      if (data.contents && data.status.content_type.includes('xml')) updateState(link, data.contents);
      else {
        stateWatcher.error = 'Ресурс не содержит валидный RSS';
        stateWatcher.formState = 'filling';
      }
    })
    .catch((err) => {
      stateWatcher.error = err.message;
      stateWatcher.formState = 'filling';
    });
};
const validateLink = (link) => {
  const stateWatcher = genStateWatcher(state);

  stateWatcher.formState = 'sending';

  const linkScheme = yup.string()
    .url('Ссылка должна быть валидным URL')
    .required()
    .notOneOf(state.links, 'RSS уже существует');

  linkScheme.validate(link)
    .then(() => getDataContents(link))
    .catch((err) => {
      stateWatcher.error = err.message;
      stateWatcher.formState = 'filling';
      console.log(stateWatcher.error.message);
    });
};

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const formData = new FormData(form);

  validateLink(formData.get('url'));
});

import './styles.scss';
import 'bootstrap';
import i18next from 'i18next';
import ru from './langs/ru.js';
import en from './langs/en.js';
import app from './app.js';

const i18nInstance = i18next.createInstance();

i18nInstance.init({
  lng: 'ru',
  resources: { en, ru },
}, (err, t) => {
  if (err) {
    console.log(err);
    return;
  }

  app(t);
});

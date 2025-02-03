import './styles.scss';
import 'bootstrap';
import i18next from 'i18next';
import ru from './langs/ru.json';
import en from './langs/en.json';
import app from './app.js';

i18next.createInstance({
  lng: 'ru',
  resources: {
    en: { translation: en },
    ru: { translation: ru },
  },
}, (err, t) => {
  if (err) {
    console.log(err);
    return;
  }

  app(t);
});

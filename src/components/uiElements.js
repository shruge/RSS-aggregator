export const genBtn = (text) => {
  const btn = document.createElement('button');

  btn.textContent = text;
  btn.classList.add('btn');

  return btn;
};
export const genList = () => {
  const list = document.createElement('ul');

  list.classList.add('list-group', 'border-0', 'rounded-0');

  return list;
};
export const genLi = () => {
  const li = document.createElement('li');

  li.classList.add('list-group-item', 'border-0', 'border-end-0');

  return li;
};

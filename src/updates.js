//
// util functions
//
const clone = obj => JSON.parse(JSON.stringify(obj)); // naive but cool!

const assoc = (obj, prop, value) => {
  const cl = clone(obj);
  cl[prop] = value;
  return cl;
};

const append = (array, value) => {
  const cl = clone(array);
  cl.push(value);
  return cl;
};

//
// Update functions
//
const Updates = {
  page(state, direction) {
    const nextCurrent = direction === 'next'
      ? Math.min(state.current + 1, state.words.length - 1)
      : Math.max(state.current - 1, 0);

    return assoc(state, 'current', nextCurrent);
  },
  add(state, newWord) {
    return assoc(state, 'words', append(state.words, newWord));
  },
  loading(state, loadingState) {
    return assoc(state, 'loading', loadingState);
  }
};

export default Updates;

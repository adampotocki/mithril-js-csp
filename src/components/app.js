import m from 'mithril';
import { putAsync } from 'js-csp';

import CreateWord from './createWord';

const App = {
  view(vnode) {
    const state = vnode.attrs.appState;
    const currentWord = state.words[state.current];

    return m('div', [
      m('p', `Current word: ${currentWord}`),
      m('p', [
        m('button.uk-button.uk-margin-right', { onclick: e => this.page(vnode, 'prev') }, 'Previous'),
        m('button.uk-button.uk-margin-right', { onclick: e => this.page(vnode, 'next') }, 'Next')
      ]),
      m(CreateWord, {
        complexActionsChannels: vnode.attrs.complexActionsChannels,
        loading: vnode.attrs.appState.loading
      }),
      m('pre', JSON.stringify(state, null, ' '))
    ]);
  },
  page(vnode, direction) {
    const ch = vnode.attrs.updateChannels.page;
    return putAsync(ch, direction);
  }
};

export default App;

import 'babel-polyfill/dist/polyfill';
import {chan, go, take, put, putAsync, buffers} from 'js-csp';
import m from 'mithril';

import Updates from './updates';
import ComplexActions from './complexActions';

import App from './components/app';

const loadApp = () => ({
  state: {
    words: ['first', 'second', 'third'],
    current: 0,
    loading: false
  },
  updates: {
    channels: {
      page: chan(),
      add: chan(),
      loading: chan()
    },
    consumers: {
      page: Updates.page,
      add: Updates.add,
      loading: Updates.loading
    }
  },
  complexActions: {
    channels: {
      dbInsert: chan()
    },
    consumers: {
      dbInsert: ComplexActions.dbInsert
    }
  },
  renderCh: chan(buffers.sliding(1))
});

const initUpdates = app => {
  Object.keys(app.updates.consumers).map(k => {
    const updateFn = app.updates.consumers[k];
    const ch = app.updates.channels[k];
    go(function* () {
      while (true) {
        const value = yield take(ch);
        console.log(`On update channel [ ${k} ] received value [ ${JSON.stringify(value)} ]`);
        app.state = updateFn(app.state, value);
        yield put(app.renderCh, app.state);
      }
    });
  });
};

const initComplexActions = app => {
  Object.keys(app.complexActions.consumers).map(k => {
    const complexActionFn = app.complexActions.consumers[k];
    const ch = app.complexActions.channels[k];
    go(function* () {
      while (true) {
        const value = yield take(ch);
        console.log(`On complex action channel [ ${k} ] received value [ ${JSON.stringify(value)} ]`);
        complexActionFn(app.updates.channels, value);
      }
    });
  });
};

const initRender = (app, element) => {
  putAsync(app.renderCh, app.state);

  go(function* () {
    while(true) {
      const state = yield take(app.renderCh);
      const finishRender = chan();

      m.render(element, m(App, {
        appState: app.state,
        updateChannels: app.updates.channels,
        complexActionsChannels: app.complexActions.channels
      }));

      window.requestAnimationFrame(() => putAsync(finishRender, {}));
      yield take(finishRender);
    }
  });
};

const start = () => {
  let app = loadApp();
  initUpdates(app);
  initComplexActions(app);
  initRender(app, document.getElementById('appRoot'));
};

start();

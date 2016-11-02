import { go, put, timeout } from 'js-csp';

//
// complex action functions
//
const ComplexActions = {
  dbInsert(updateChannels, newWord) {
    go(function* () {
      yield put(updateChannels.loading, true);

      // simulate do something costly with timeout
      yield timeout(1000);

      yield put(updateChannels.add, newWord);
      yield put(updateChannels.loading, false);
    });
  }
};

export default ComplexActions;

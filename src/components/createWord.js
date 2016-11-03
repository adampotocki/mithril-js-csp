import m from 'mithril';
import { putAsync } from 'js-csp';

const CreateWord = {
  oninit(vnode) {
    vnode.state.inputText = m.prop('');
  },
  view(vnode) {
    const loading = vnode.attrs.loading;

    return loading
      ? m('p', 'Adding word...')
      : m('p.uk-form', [
          m('input[type="text"]', {
            value: vnode.state.inputText(),
            onchange: m.withAttr('value', vnode.state.inputText)
          }),
          m('button.uk-button.uk-margin-left', {
            onclick: e => this.create(vnode)
          },'Add...')
        ])
  },
  create(vnode) {
    const text = vnode.state.inputText().trim();
    const ch = vnode.attrs.complexActionsChannels.dbInsert;
    putAsync(ch, text);
    vnode.state.inputText('');
  }
};

export default CreateWord;

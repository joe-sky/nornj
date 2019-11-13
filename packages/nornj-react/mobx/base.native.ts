import { registerComponent, registerFilter } from 'nornj';
import { toJS } from 'mobx';
import { Provider } from 'mobx-react/native';
import './lib/extension/mobxBind';
import './lib/extension/mobxObserver';

registerComponent('mobx-Provider', Provider);
registerFilter('toJS', v => toJS(v));

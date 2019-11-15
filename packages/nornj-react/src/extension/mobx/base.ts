import { registerComponent, registerFilter } from 'nornj';
import { toJS } from 'mobx';
import { Provider } from 'mobx-react';
import './mobxBind';
import './mobxObserver';

registerComponent('mobx-Provider', Provider);
registerFilter('toJS', v => toJS(v));

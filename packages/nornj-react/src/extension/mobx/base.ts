import { registerFilter } from 'nornj';
import { toJS } from 'mobx';
import './mobxBind';
import './mobxObserver';

registerFilter('toJS', v => toJS(v));

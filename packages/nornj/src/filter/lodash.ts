import { registerFilter } from 'nornj';
import _ from 'lodash';

Object.keys(_).forEach(name => registerFilter(name, _[name]));

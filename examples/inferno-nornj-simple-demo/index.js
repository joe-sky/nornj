import nj from '../../src/base.js';
import Inferno from 'inferno';
import InfernoDOM from 'inferno-dom';
import createElement from 'inferno/dist/inferno-create-element';
import './components/TestComponent/component';

nj.setComponentEngine('inferno', Inferno, InfernoDOM, createElement, 'render');

//Set default data for first render NornJ html template.
nj.setInitTagData({
  no: 100,
  list: [1, 2, 3, 4, 5]
});
import { registerComponent } from 'nornj';
import {
  BrowserRouter,
  HashRouter,
  Link,
  MemoryRouter,
  NavLink,
  Prompt,
  Redirect,
  Route,
  Router,
  StaticRouter,
  Switch
} from 'react-router-dom';

registerComponent({
  BrowserRouter,
  HashRouter,
  'router-Link': Link,
  MemoryRouter,
  'router-NavLink': NavLink,
  'router-Prompt': Prompt,
  Redirect,
  Route,
  Router,
  StaticRouter,
  'router-Switch': Switch
});

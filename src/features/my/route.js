// import { WelcomePage } from './';
import loadable from 'react-loadable';
import ReactLoadableLoading from '../common/ReactLoadableLoading.js';

let Login = loadable({
  loader: () => import('./Login.js'),
  loading: ReactLoadableLoading
});


export default {
  path: 'my',
  // component: Login,
  childRoutes: [{ path: 'login', component: Login }],
};

// import { WelcomePage } from './';
import loadable from 'react-loadable';
import ReactLoadableLoading from '../common/ReactLoadableLoading.js';

let Recommend = loadable({
  loader: () => import('./Recommend.js'),
  loading: ReactLoadableLoading
});
let Layout = loadable({
  loader: () => import('./Layout.js'),
  loading: ReactLoadableLoading
});


export default {
  path: 'home',
  component: Layout,
  childRoutes: [{ path: 'recommend', component: Recommend, isIndex: true }],
};

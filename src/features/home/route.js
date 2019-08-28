// import { WelcomePage } from './';
import loadable from 'react-loadable';
import ReactLoadableLoading from '../common/ReactLoadableLoading.js';

let Recommend = loadable({
  loader: () => import('./Recommend.js'),
  loading: ReactLoadableLoading
});
export default {
  path: '',
  childRoutes: [{ path: 'recommend', component: Recommend, isIndex: true }],
};

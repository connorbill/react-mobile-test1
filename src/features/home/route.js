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
let WelcomePage = loadable({
  loader: () => import('./WelcomePage.js'),
  loading: ReactLoadableLoading
});
let GameClass = loadable({
  loader: () => import('./GameClass.js'),
  loading: ReactLoadableLoading
});


export default {
  path: '',
  childRoutes: [
    { component: WelcomePage, isIndex: true },
    { path: 'home', component: Layout,
      childRoutes: [
        { path: 'recommend',component: Recommend, isIndex: true },
        { path: 'class',component: GameClass },
      ],
    }
  ],
};

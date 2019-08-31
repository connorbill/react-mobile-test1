import axios from 'axios';
import {
  HOT_FETCH_GAME_LIST_BEGIN,
  HOT_FETCH_GAME_LIST_SUCCESS,
  HOT_FETCH_GAME_LIST_FAILURE,
  HOT_FETCH_GAME_LIST_DISMISS_ERROR,
} from './constants';

// Rekit uses redux-thunk for async actions by default: https://github.com/gaearon/redux-thunk
// If you prefer redux-saga, you can use rekit-plugin-redux-saga: https://github.com/supnate/rekit-plugin-redux-saga
export function fetchGameList(args = {}) {
  return (dispatch) => {
    // optionally you can have getState as the second argument
    dispatch({
      type: HOT_FETCH_GAME_LIST_BEGIN,
    });

    // Return a promise so that you could control UI flow without states in the store.
    // For example: after submit a form, you need to redirect the page to another when succeeds or show some errors message if fails.
    // It's hard to use state to manage it, but returning a promise allows you to easily achieve it.
    // e.g.: handleSubmit() { this.props.actions.submitForm(data).then(()=> {}).catch(() => {}); }
    const promise = new Promise((resolve, reject) => {
      // doRequest is a placeholder Promise. You should replace it with your own logic.
      // See the real-word example at:  https://github.com/supnate/rekit/blob/master/src/features/home/redux/fetchRedditReactjsList.js
      // args.error here is only for test coverage purpose.
      const doRequest = axios.get('/api/cp4/front/h5/hot');

      doRequest.then(
        res => {
          dispatch({
            type: HOT_FETCH_GAME_LIST_SUCCESS,
            data: res.data,
          });
          resolve(res);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        err => {
          dispatch({
            type: HOT_FETCH_GAME_LIST_FAILURE,
            data: { error: err },
          });
          reject(err);
        }
      );
    });

    return promise;
  };
}

// Async action saves request error by default, this method is used to dismiss the error info.
// If you don't want errors to be saved in Redux store, just ignore this method.
export function dismissFetchGameListError() {
  return {
    type: HOT_FETCH_GAME_LIST_DISMISS_ERROR,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case HOT_FETCH_GAME_LIST_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        fetchGameListPending: true,
        fetchGameListError: null,
      };

    case HOT_FETCH_GAME_LIST_SUCCESS:
      // The request is success
      return {
        ...state,
        GameList: action.data.data.children,

        fetchGameListPending: false,
        fetchGameListError: null,
      };

    case HOT_FETCH_GAME_LIST_FAILURE:
      // The request is failed
      return {
        ...state,
        fetchGameListPending: false,
        fetchGameListError: action.data.error,
      };

    case HOT_FETCH_GAME_LIST_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        fetchGameListError: null,
      };

    default:
      return state;
  }
}

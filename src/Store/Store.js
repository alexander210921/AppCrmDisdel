import {createStore, applyMiddleware, compose} from 'redux';
import thunk from 'redux-thunk';
import rootReducers from './Reducers/index';

let composeEnhacer = compose;
if (__DEV__) {
  composeEnhacer = window.__REDUX_DEVTOOLS_EXTENSION__ || compose;
}
const store = createStore(rootReducers, applyMiddleware(thunk));

export default store;
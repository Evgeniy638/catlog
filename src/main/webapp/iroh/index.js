/* eslint-disable no-unused-vars */
import { loginActionCreators } from '../bll/reducers/reducerLogin.js';
// eslint-disable-next-line no-unused-vars
import Iroh from 'iroh';
import { initAndRunStage } from './initAndRunStage.js';
import reducerLoginStage from './bll/reducerLoginStage.js';
import reducerPostStage from './bll/reducerPostStage.js';


const stageLogin = initAndRunStage(reducerLoginStage);
eval(stageLogin.script);

const stagePost = initAndRunStage(reducerPostStage);
eval(stagePost.script);

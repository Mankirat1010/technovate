import express from 'express';
export const feedBackRouter = express.Router();
import {
    verifyJwt,
    optionalVerifyJwt,
    isOwner,
    doesResourceExist,
} from '../middlewares/index.js';
import {
    addFeedBack,
    getFeedBacks,
    deleteFeedBack,
    updateFeedBack,
} from '../controllers/feedback.Controller.js';

const isFeedBackOwner = isOwner('feedback', 'user_id');
const doesPostExist = doesResourceExist('event', 'eventId', 'event');
const doesFeedBackExist = doesResourceExist(
    'feedback',
    'feedBackId',
    'feedback'
);

feedBackRouter
    .route('/event/:eventId')
    .get(doesPostExist, optionalVerifyJwt, getFeedBacks);

feedBackRouter.use(verifyJwt);

feedBackRouter.route('/:eventId').post(doesPostExist, addFeedBack);

feedBackRouter
    .route('/feedBack/:feedBackId')
    .all(doesFeedBackExist, isFeedBackOwner)
    .patch(updateFeedBack)
    .delete(deleteFeedBack);

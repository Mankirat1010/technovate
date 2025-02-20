// import express from 'express';
// export const likeRouter = express.Router();
// import { verifyJwt, doesResourceExist } from '../middlewares/index.js';
// import {
//     getLikedPosts,
//     toggleCommentLike,
//     togglePostLike,
// } from '../controllers/like.Controller.js';

// const doesPostExist = doesResourceExist('post', 'postId', 'post');
// const doesCommentExist = doesResourceExist('comment', 'commentId', 'comment');

// likeRouter.use(verifyJwt);

// likeRouter.route('/').get(getLikedPosts);

// likeRouter
//     .route('/toggle-post-like/:postId')
//     .patch(doesPostExist, togglePostLike);

// likeRouter
//     .route('/toggle-comment-like/:commentId')
//     .patch(doesCommentExist, toggleCommentLike);

import express from 'express';
export const likeRouter = express.Router();
import { verifyJwt, doesResourceExist } from '../middlewares/index.js';
import {
    getLikedEvents,
    toggleFeedbackLike,
    toggleEventLike,
} from '../controllers/like.Controller.js';

const doesEventExist = doesResourceExist('event', 'eventId', 'event');
const doesFeedbackExist = doesResourceExist(
    'feedback',
    'feedbackId',
    'feedback'
);

likeRouter.use(verifyJwt);

likeRouter.route('/').get(getLikedEvents);

likeRouter
    .route('/toggle-event-like/:eventId')
    .patch(doesEventExist, toggleEventLike);

likeRouter
    .route('/toggle-feedback-like/:feedbackId')
    .patch(doesFeedbackExist, toggleFeedbackLike);

// import express from 'express';
// export const postRouter = express.Router();
// import {
//     upload,
//     verifyJwt,
//     optionalVerifyJwt,
//     doesResourceExist,
//     isOwner,
//     validateUUID,
// } from '../middlewares/index.js';

// import {
//     getPost,
//     getPosts,
//     getRandomPosts,
//     addPost,
//     deletePost,
//     updatePostDetails,
//     updateThumbnail,
//     togglePostVisibility,
//     getSavedPosts,
//     toggleSavePost,
// } from '../controllers/event.Controller.js';

// const isPostOwner = isOwner('event', 'event_ownerId');
// const doesPostExist = doesResourceExist('event', 'eventId', 'event');
// const doesChannelExist = doesResourceExist('user', 'channelId', 'channel');

// postRouter.route('/all').get(getRandomPosts);

// postRouter.route('/channel/:channelId').get(doesChannelExist, getPosts);

// postRouter
//     .route('/post/:eventId')
//     .get(validateUUID('eventId'), optionalVerifyJwt, getPost);

// postRouter.use(verifyJwt);

// postRouter.route('/saved').get(getSavedPosts);

// postRouter.route('/toggle-save/:postId').post(doesPostExist, toggleSavePost);

// postRouter.route('/add').post(upload.single('eventImage'), addPost);

// postRouter
//     .route('/delete/:postId')
//     .delete(doesPostExist, isPostOwner, deletePost);

// postRouter
//     .route('/details/:postId')
//     .patch(doesPostExist, isPostOwner, updatePostDetails);

// postRouter
//     .route('/image/:postId')
//     .patch(
//         doesPostExist,
//         isPostOwner,
//         upload.single('eventImage'),
//         updateThumbnail
//     );

// postRouter
//     .route('/visibility/:postId')
//     .patch(doesPostExist, isPostOwner, togglePostVisibility);

import express from 'express';
export const eventRouter = express.Router();
import {
    upload,
    verifyJwt,
    optionalVerifyJwt,
    doesResourceExist,
    isOwner,
    validateUUID,
} from '../middlewares/index.js';

import {
    getEvent,
    getEvents,
    getRandomEvents,
    addEvent,
    deleteEvent,
    updateEventDetails,
    updateThumbnail,
    toggleEventVisibility,
    getSavedEvents,
    toggleSaveEvent,
} from '../controllers/event.Controller.js';

const isEventOwner = isOwner('event', 'event_ownerId');
const doesEventExist = doesResourceExist('event', 'eventId', 'event');
const doesChannelExist = doesResourceExist('user', 'channelId', 'channel');

eventRouter.route('/all').get(getRandomEvents);

eventRouter.route('/channel/:channelId').get(doesChannelExist, getEvents);

eventRouter
    .route('/event/:eventId')
    .get(validateUUID('eventId'), optionalVerifyJwt, getEvent);

eventRouter.use(verifyJwt);

eventRouter.route('/saved').get(getSavedEvents);

eventRouter
    .route('/toggle-save/:eventId')
    .post(doesEventExist, toggleSaveEvent);

eventRouter.route('/add').post(upload.single('eventImage'), addEvent);

eventRouter
    .route('/delete/:eventId')
    .delete(doesEventExist, isEventOwner, deleteEvent);

eventRouter
    .route('/details/:eventId')
    .patch(doesEventExist, isEventOwner, updateEventDetails);

eventRouter
    .route('/image/:eventId')
    .patch(
        doesEventExist,
        isEventOwner,
        upload.single('eventImage'),
        updateThumbnail
    );

eventRouter
    .route('/visibility/:eventId')
    .patch(doesEventExist, isEventOwner, toggleEventVisibility);

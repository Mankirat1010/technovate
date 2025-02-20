// import { OK, BAD_REQUEST } from '../constants/errorCodes.js';
import { getServiceObject } from '../db/serviceObjects.js';
import { ErrorHandler, tryCatch, verifyOrderBy } from '../utils/index.js';

export const feedbackObject = getServiceObject('feedBacks');

const getFeedBacks = tryCatch('get feedbacks', async (req, res, next) => {
    const { eventId } = req.params;
    const { orderBy = 'desc' } = req.query;

    if (!verifyOrderBy(orderBy)) {
        return next(new ErrorHandler('invalid orderBy value', BAD_REQUEST));
    }

    const feedBacks = await feedBackObject.getFeedBacks(
        eventId,
        req.user?.user_id,
        orderBy.toUpperCase()
    );

    if (feedBacks.length) {
        return res.status(OK).json(feedBacks);
    } else {
        return res.status(OK).json({ message: 'no feedbacks found' });
    }
});

const addFeedBack = tryCatch('add feedback', async (req, res, next) => {
    const user = req.user;
    const { eventId } = req.params;
    const { feedBackContent } = req.body;

    if (!feedBackContent) {
        return next(new ErrorHandler('missing fields', BAD_REQUEST));
    }

    const feedback = await feedbackObject.createFeedback(
        user.user_id,
        eventId,
        feedBackContent
    );

    const modifiedFeedback = {
        ...feedback,
        user_name: user.user_name,
        user_firstName: user.user_firstName,
        user_lastName: user.user_lastName,
        user_avatar: user.user_avatar,
    };

    return res.status(OK).json(modifiedFeedback);
});

const deleteFeedBack = tryCatch('delete feedback', async (req, res) => {
    const { feedbackId } = req.params;
    await feedbackObject.deleteFeedback(feedbackId);
    return res.status(OK).json({ message: 'feedback deleted successfully' });
});

const updateFeedBack = tryCatch('update feedback', async (req, res, next) => {
    const { feedBackContent } = req.body;
    const { feedBackId } = req.params;

    if (!feedBackContent) {
        return next(new ErrorHandler('missing fields', BAD_REQUEST));
    }

    const updatedFeedBack = await feedbackObject.editFeedback(
        feedBackId,
        feedBackContent
    );
    return res.status(OK).json(updatedFeedBack);
});

export { getFeedBacks, addFeedBack, deleteFeedBack, updateFeedBack };

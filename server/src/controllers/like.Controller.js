import { OK, BAD_REQUEST } from '../constants/errorCodes.js';
import { getServiceObject } from '../db/serviceObjects.js';
import { verifyOrderBy, tryCatch, ErrorHandler } from '../utils/index.js';

export const likeObject = getServiceObject('likes');

const getLikedEvents = tryCatch('get liked events', async (req, res, next) => {
    const { user_id } = req.user;
    const { orderBy = 'desc', limit = 10, page = 1 } = req.query;

    if (!verifyOrderBy(orderBy)) {
        return next(new ErrorHandler('invalid orderBy value', BAD_REQUEST));
    }

    const result = await likeObject.getLikedEvents(
        user_id,
        orderBy.toUpperCase(),
        Number(limit),
        Number(page)
    );

    if (result.docs.length) {
        const data = {
            events: result.docs,
            eventInfo: {
                hasNextPage: result.hasNextPage,
                hasPrevPage: result.hasPrevPage,
                totalEvents: result.totalDocs,
            },
        };
        return res.status(OK).json(data);
    } else {
        return res.status(OK).json({ message: 'no events liked' });
    }
});

const toggleEventLike = tryCatch('toggle event like', async (req, res) => {
    const { user_id } = req.user;
    const { eventId } = req.params;
    let { likedStatus } = req.query;

    likedStatus = likedStatus === 'true' ? 1 : 0;

    await likeObject.toggleEventLike(user_id, eventId, likedStatus);
    return res.status(OK).json({ message: 'event like toggled successfully' });
});

const toggleFeedbackLike = tryCatch(
    'toggle feedback like',
    async (req, res) => {
        const { user_id } = req.user;
        const { feedBackId } = req.params;
        let { likedStatus } = req.query;
        likedStatus = likedStatus === 'true' ? 1 : 0;

        await likeObject.toggleFeedbackLike(user_id, feedBackId, likedStatus);
        return res
            .status(OK)
            .json({ message: 'feedback like toggled successfully' });
    }
);

export { getLikedEvents, toggleEventLike, toggleFeedbackLike };

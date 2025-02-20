

import { getServiceObject } from '../db/serviceObjects.js';
import { OK, BAD_REQUEST, NOT_FOUND } from '../constants/errorCodes.js';
import { verifyOrderBy, tryCatch, ErrorHandler } from '../utils/index.js';
import { uploadOnCloudinary, deleteFromCloudinary } from '../helpers/index.js';
import { userObject } from './user.Controller.js';
import { categoryObject } from './category.Controller.js';
import validator from 'validator';

export const eventObject = getServiceObject('events');

// pending searchTerm (query)
const getRandomEvents = tryCatch(
    'get random events',
    async (req, res, next) => {
        const {
            limit = 10,
            orderBy = 'desc',
            page = 1,
            categoryId,
            query = '',
        } = req.query;

        if (!verifyOrderBy(orderBy)) {
            return next(new ErrorHandler('invalid orderBy value', BAD_REQUEST));
        }

        if (categoryId) {
            if (!validator.isUUID(categoryId)) {
                return next(
                    new ErrorHandler(
                        'missing or invalid categoryId',
                        BAD_REQUEST
                    )
                );
            } else {
                const category = await categoryObject.getCategory(categoryId);
                if (!category) {
                    return next(
                        new ErrorHandler('category not found', NOT_FOUND)
                    );
                }
            }
        }

        const result = await eventObject.getRandomEvents(
            Number(limit),
            orderBy.toUpperCase(),
            Number(page),
            categoryId
        );

        if (result.docs.length) {
            const data = {
                events: result.docs,
                eventsInfo: {
                    hasNextPage: result.hasNextPage,
                    hasPrevPage: result.hasPrevPage,
                    totalEvents: result.totalDocs,
                },
            };
            return res.status(OK).json(data);
        } else {
            return res.status(OK).json({ message: 'no events found' });
        }
    }
);

const getEvents = tryCatch('get events', async (req, res, next) => {
    const channelId = req.channel.user_id;
    const {
        orderBy = 'desc',
        limit = 10,
        page = 1,
        categoryId = '',
    } = req.query;

    if (!verifyOrderBy(orderBy)) {
        return next(new ErrorHandler('invalid orderBy value', BAD_REQUEST));
    }

    if (categoryId) {
        if (!validator.isUUID(categoryId)) {
            return next(
                new ErrorHandler('missing or invalid categoryId', BAD_REQUEST)
            );
        } else {
            const category = await categoryObject.getCategory(categoryId);
            if (!category) {
                return next(new ErrorHandler('category not found', NOT_FOUND));
            }
        }
    }

    const result = await eventObject.getEvents(
        channelId,
        Number(limit),
        orderBy.toUpperCase(),
        Number(page),
        categoryId
    );

    if (result.docs.length) {
        const data = {
            events: result.docs,
            eventsInfo: {
                hasNextPage: result.hasNextPage,
                hasPrevPage: result.hasPrevPage,
                totalEvents: result.totalDocs,
            },
        };
        return res.status(OK).json(data);
    } else {
        return res.status(OK).json({ message: 'no events found' });
    }
});

const getEvent = tryCatch('get event', async (req, res, next) => {
    const { eventId } = req.params;
    const userId = req.user?.user_id;

    const event = await eventObject.getEvent(eventId, userId);
    if (!event) {
        return next(new ErrorHandler('event not found', NOT_FOUND));
    }

    let userIdentifier = userId || req.ip;

    // update user's watch history
    if (userId) {
        await userObject.updateWatchHistory(eventId, userId);
    }

    // update event views
    await eventObject.updateEventViews(eventId, userIdentifier);

    return res.status(OK).json(event);
});

const addEvent = tryCatch('add event', async (req, res, next) => {
    let eventImage;
    try {
        const { title, content, categoryId, date, venue, duration } = req.body;

        if (!title || !content || !req.file || !date || !venue)
            return next(new ErrorHandler('missing fields', BAD_REQUEST));

        if (!categoryId) {
            return next(
                new ErrorHandler('missing or invalid categoryId', BAD_REQUEST)
            );
        }

        const category = await categoryObject.getCategory(categoryId);
        if (!category) {
            return next(new ErrorHandler('category not found', NOT_FOUND));
        }

        const result = await uploadOnCloudinary(req.file.path);
        eventImage = result.secure_url;

        const event = await eventObject.createEvent({
            userId: req.user.user_id,
            title,
            content,
            categoryId: category.category_id,
            eventImage,
            date,
            duration,
            venue,
        });
        console.log(event);
        return res.status(OK).json(event);
    } catch (err) {
        if (eventImage) {
            await deleteFromCloudinary(eventImage);
        }
        throw err;
    }
});

const deleteEvent = tryCatch('delete event', async (req, res) => {
    const { event_image, event_id } = req.event;
    await eventObject.deleteEvent(event_id);
    await deleteFromCloudinary(event_image);
    return res.status(OK).json({ message: 'event deleted successfully' });
});

const updateEventDetails = tryCatch(
    'update event details',
    async (req, res, next) => {
        const { event_id } = req.event;
        const { title, content, categoryId } = req.body;

        if (!title || !content) {
            return next(new ErrorHandler('missing fields', BAD_REQUEST));
        }

        if (!categoryId || !validator.isUUID(categoryId)) {
            return next(
                new ErrorHandler('missing or invalid categoryId', BAD_REQUEST)
            );
        }

        const category = await categoryObject.getCategory(categoryId);
        if (!category) {
            return next(new ErrorHandler('category not found', NOT_FOUND));
        }

        const updatedEvent = await eventObject.updateEventDetails({
            eventId: event_id,
            title,
            content,
            categoryId: category.category_id,
        });

        return res.status(OK).json(updatedEvent);
    }
);

const toggleEventVisibility = tryCatch(
    'toggle event visibility',
    async (req, res) => {
        const { event_id, event_visibility } = req.post;
        await eventObject.togglePostVisibility(event_id, !event_visibility);
        return res
            .status(OK)
            .json({ message: 'event visibility toggled successfully' });
    }
);

const toggleSaveEvent = tryCatch('toggle save event', async (req, res) => {
    const { user_id } = req.user;
    const { event_id } = req.event;
    await eventObject.toggleSaveEvent(user_id, event_id);
    return res.status(OK).json({ message: 'event save toggled successfully' });
});

const getSavedEvents = tryCatch('get saved events', async (req, res, next) => {
    const { user_id } = req.user;
    const { orderBy = 'desc', limit = 10, page = 1 } = req.query;

    if (!verifyOrderBy(orderBy)) {
        return next(new ErrorHandler('invalid orderBy value', BAD_REQUEST));
    }

    const result = await eventObject.getSavedEvents(
        user_id,
        orderBy.toUpperCase(),
        Number(limit),
        Number(page)
    );

    if (result.docs.length) {
        const data = {
            posts: result.docs,
            postaInfo: {
                hasNextPage: result.hasNextPage,
                hasPrevPage: result.hasPrevPage,
                totalPosts: result.totalDocs,
            },
        };
        return res.status(OK).json(data);
    } else {
        return res.status(OK).json({ message: 'no saved posts' });
    }
});

const updateThumbnail = tryCatch(
    'update event thumbnail',
    async (req, res, next) => {
        let eventImage;
        try {
            const { event_id, event_image } = req.event;

            if (!req.file) {
                return next(new ErrorHandler('missing thumbnail', BAD_REQUEST));
            }

            const result = await uploadOnCloudinary(req.file?.path);
            eventImage = result.secure_url;

            // delete old thumbnail
            await deleteFromCloudinary(event_image);

            const updatedPost = await eventObject.updateeventImage(
                event_id,
                eventImage
            );

            return res.status(OK).json(updatedPost);
        } catch (err) {
            if (eventImage) {
                await deleteFromCloudinary(eventImage);
            }
            throw err;
        }
    }
);

export {
    getRandomEvents,
    getEvents,
    getEvent,
    addEvent,
    updateThumbnail,
    updateEventDetails,
    deleteEvent,
    toggleEventVisibility,
    toggleSaveEvent,
    getSavedEvents,
};

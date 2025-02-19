import { Iposts } from '../../interfaces/post.Interface.js';
import { Event, EventView, SavedEvent } from '../../schemas/MongoDB/index.js';
import { getPipeline1 } from '../../helpers/index.js';

export class MongoDBposts extends Iposts {
    // pending search query
    async getRandomPosts(limit, orderBy, page, categoryId) {
        try {
            const pipeline = categoryId
                ? [{ $match: { event_category: categoryId } }]
                : [];

            pipeline.push(
                ...[
                    {
                        $lookup: {
                            from: 'categories',
                            localField: 'event_category',
                            foreignField: 'category_id',
                            as: 'category',
                        },
                    },
                    { $unwind: '$category' },
                    {
                        $lookup: {
                            from: 'users',
                            localField: 'event_ownerId',
                            foreignField: 'user_id',
                            as: 'owner',
                            pipeline: [
                                {
                                    $project: {
                                        user_id: 1,
                                        user_name: 1,
                                        user_avatar: 1,
                                        user_lastName: 1,
                                        user_firstName: 1,
                                    },
                                },
                            ],
                        },
                    },
                    { $unwind: '$owner' },
                    {
                        $lookup: {
                            from: 'postviews',
                            localField: 'event_id',
                            foreignField: 'event_id',
                            as: 'views',
                        },
                    },
                    { $sort: { event_updatedAt: orderBy === 'DESC' ? -1 : 1 } },
                    { $addFields: { totalViews: { $size: '$views' } } },
                    { $project: { event_category: 0, views: 0 } },
                ]
            );

            return await Event.aggregatePaginate(pipeline, { page, limit });
        } catch (err) {
            throw err;
        }
    }

    async getEvents(channelId, limit, orderBy, page, categoryId) {
        try {
            const pipeline = categoryId
                ? [
                      {
                          $match: {
                              event_ownerId: channelId,
                              event_category: categoryId,
                          },
                      },
                  ]
                : [{ $match: { event_ownerId: channelId } }];

            // concat() returns a modified new array
            pipeline.push(
                ...[
                    {
                        $lookup: {
                            from: 'categories',
                            localField: 'event_category',
                            foreignField: 'category_id',
                            as: 'category',
                        },
                    },
                    { $unwind: '$category' },
                    {
                        $lookup: {
                            from: 'postviews',
                            localField: 'event_id',
                            foreignField: 'event_id',
                            as: 'views',
                        },
                    },
                    { $sort: { event_updatedAt: orderBy === 'DESC' ? -1 : 1 } },
                    { $addFields: { totalViews: { $size: '$views' } } },
                    { $project: { event_category: 0, views: 0 } },
                ]
            );

            return await Event.aggregatePaginate(pipeline, { page, limit });
        } catch (err) {
            throw err;
        }
    }

    async postExistance(eventId) {
        try {
            return await Event.findOne({ event_id: eventId }).lean();
        } catch (err) {
            throw err;
        }
    }

    async getEvent(eventId, userId) {
        try {
            const pipeline = [
                { $match: { event_id: eventId } },
                {
                    $lookup: {
                        from: 'categories',
                        localField: 'event_category',
                        foreignField: 'category_id',
                        as: 'category',
                    },
                },
                { $unwind: '$category' },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'event_ownerId',
                        foreignField: 'user_id',
                        as: 'owner',
                    },
                },
                { $unwind: '$owner' },
                {
                    $lookup: {
                        from: 'postlikes',
                        localField: 'event_id',
                        foreignField: 'event_id',
                        as: 'likes',
                        pipeline: [
                            { $match: { is_liked: true } },
                            { $project: { user_id: 1 } },
                        ],
                    },
                },
                {
                    $lookup: {
                        from: 'postlikes',
                        localField: 'event_id',
                        foreignField: 'event_id',
                        as: 'dislikes',
                        pipeline: [
                            { $match: { is_liked: false } },
                            { $project: { user_id: 1 } },
                        ],
                    },
                },
                {
                    $lookup: {
                        from: 'postviews',
                        localField: 'event_id',
                        foreignField: 'event_id',
                        as: 'views',
                    },
                },
                {
                    $addFields: {
                        totalLikes: { $size: '$likes' },
                        totalDislikes: { $size: '$dislikes' },
                        totalViews: { $size: '$views' },
                    },
                },
            ];

            // Conditionally add user-related stages
            if (userId) {
                pipeline.push(
                    {
                        $lookup: {
                            from: 'savedposts',
                            localField: 'event_id',
                            foreignField: 'event_id',
                            as: 'saved_posts',
                            pipeline: [{ $match: { user_id: userId } }],
                        },
                    },
                    {
                        $lookup: {
                            from: 'followers',
                            localField: 'event_ownerId',
                            foreignField: 'following_id',
                            as: 'followers',
                            pipeline: [{ $match: { follower_id: userId } }],
                        },
                    },
                    {
                        $addFields: {
                            isFollowed: { $gt: [{ $size: '$followers' }, 0] },
                            isSaved: { $gt: [{ $size: '$saved_posts' }, 0] },
                            isLiked: {
                                $in: [
                                    userId,
                                    {
                                        $map: {
                                            input: '$likes',
                                            as: 'like',
                                            in: '$$like.user_id',
                                        },
                                    },
                                ],
                            },
                            isDisliked: {
                                $in: [
                                    userId,
                                    {
                                        $map: {
                                            input: '$dislikes',
                                            as: 'dislike',
                                            in: '$$dislike.user_id',
                                        },
                                    },
                                ],
                            },
                        },
                    }
                );
            }

            pipeline.push({ $project: { likes: 0, dislikes: 0, views: 0 } });

            const [post] = await Event.aggregate(pipeline);
            return post;
        } catch (err) {
            throw err;
        }
    }

    async createPost({ userId, title, content, categoryId, postImage }) {
        try {
            const post = await Event.create({
                event_ownerId: userId,
                event_title: title,
                event_content: content,
                event_category: categoryId,
                event_image: postImage,
            });
            return post.toObject();
        } catch (err) {
            throw err;
        }
    }

    async deletePost(eventId) {
        try {
            return await Event.findOneAndDelete({
                event_id: eventId,
            }).lean();
        } catch (err) {
            throw err;
        }
    }

    // TODO: can use pre-hook
    async updatePostViews(eventId, userIdentifier) {
        try {
            return await EventView.findOneAndUpdate(
                {
                    event_id: eventId,
                    user_identifier: userIdentifier,
                },
                {
                    $setOnInsert: {
                        event_id: eventId,
                        user_identifier: userIdentifier,
                    },
                },
                {
                    upsert: true,
                }
            ).lean();
        } catch (err) {
            throw err;
        }
    }

    async updatePostDetails({ eventId, title, content, categoryId }) {
        try {
            return await Event.findOneAndUpdate(
                { event_id: eventId },
                {
                    $set: {
                        event_title: title,
                        event_content: content,
                        event_category: categoryId,
                        event_updatedAt: new Date(),
                    },
                },
                { new: true }
            ).lean();
        } catch (err) {
            throw err;
        }
    }

    async updatePostImage(eventId, postImage) {
        try {
            return await Event.findOneAndUpdate(
                { event_id: eventId },
                {
                    $set: {
                        event_image: postImage,
                        event_updatedAt: new Date(),
                    },
                },
                { new: true }
            ).lean();
        } catch (err) {
            throw err;
        }
    }

    async togglePostVisibility(eventId, visibility) {
        try {
            return await Event.findOneAndUpdate(
                { event_id: eventId },
                { $set: { event_visibility: visibility } },
                { new: true }
            ).lean();
        } catch (err) {
            throw err;
        }
    }

    async toggleSavePost(userId, eventId) {
        try {
            const existingRecord = await SavedEvent.findOne({
                event_id: eventId,
                user_id: userId,
            });

            if (existingRecord) {
                return await existingRecord.deleteOne();
            } else {
                const record = await SavedEvent.create({
                    event_id: eventId,
                    user_id: userId,
                });
                return record.toObject();
            }
        } catch (err) {
            throw err;
        }
    }

    async getSavedPosts(userId, orderBy, limit, page) {
        try {
            const pipeline1 = getPipeline1(orderBy, 'savedAt');
            const pipeline = [{ $match: { user_id: userId } }, ...pipeline1];
            return await SavedEvent.aggregatePaginate(pipeline, { page, limit });
        } catch (err) {
            throw err;
        }
    }
}

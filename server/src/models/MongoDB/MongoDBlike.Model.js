// import { Ilikes } from '../../interfaces/like.Interface.js';
// import { CommentLike, EventLike } from '../../schemas/MongoDB/index.js';
// import { getPipeline1 } from '../../helpers/index.js';

// export class MongoDBlikes extends Ilikes {
//     async getLikedPosts(userId, orderBy, limit, page) {
//         try {
//             const pipeline1 = getPipeline1(orderBy, 'likedAt');
//             const pipeline = [
//                 { $match: { user_id: userId, is_liked: true } },
//                 ...pipeline1,
//             ];

//             return await EventLike.aggregatePaginate(pipeline, { page, limit });
//         } catch (err) {
//             throw err;
//         }
//     }

//     async toggleEventLike(userId, postId, likedStatus) {
//         try {
//             const existingRecord = await EventLike.findOne({
//                 post_id: postId,
//                 user_id: userId,
//             }); // BSON data

//             if (existingRecord) {
//                 if (existingRecord.is_liked === Boolean(likedStatus)) {
//                     return await existingRecord.deleteOne();
//                 } else {
//                     existingRecord.is_liked = likedStatus;
//                     existingRecord.likedAt = new Date();
//                     return await existingRecord.save();
//                 }
//             } else {
//                 const record = await EventLike.create({
//                     post_id: postId,
//                     user_id: userId,
//                     is_liked: likedStatus,
//                 });
//                 return record.toObject();
//             }
//         } catch (err) {
//             throw err;
//         }
//     }

//     async toggleCommentLike(userId, commentId, likedStatus) {
//         try {
//             const existingRecord = await CommentLike.findOne({
//                 comment_id: commentId,
//                 user_id: userId,
//             }); // BSON data

//             if (existingRecord) {
//                 if (existingRecord.is_liked === Boolean(likedStatus)) {
//                     return await existingRecord.deleteOne();
//                 } else {
//                     existingRecord.is_liked = likedStatus;
//                     existingRecord.likedAt = new Date();
//                     return await existingRecord.save();
//                 }
//             } else {
//                 const record = await CommentLike.create({
//                     comment_id: commentId,
//                     user_id: userId,
//                     is_liked: likedStatus,
//                 });
//                 return record.toObject();
//             }
//         } catch (err) {
//             throw err;
//         }
//     }
// }

import { Ilikes } from '../../interfaces/like.Interface.js';
import { FeedBackLike, EventLike } from '../../schemas/MongoDB/index.js';
import { getPipeline1 } from '../../helpers/index.js';

export class MongoDBlikes extends Ilikes {
    async getLikedEvents(userId, orderBy, limit, page) {
        try {
            const pipeline1 = getPipeline1(orderBy, 'likedAt');
            const pipeline = [
                { $match: { user_id: userId, is_liked: true } },
                ...pipeline1,
            ];

            return await EventLike.aggregatePaginate(pipeline, { page, limit });
        } catch (err) {
            throw err;
        }
    }

    async toggleEventLike(userId, eventId, likedStatus) {
        try {
            const existingRecord = await EventLike.findOne({
                event_id: eventId,
                user_id: userId,
            }); // BSON data

            if (existingRecord) {
                if (existingRecord.is_liked === Boolean(likedStatus)) {
                    return await existingRecord.deleteOne();
                } else {
                    existingRecord.is_liked = likedStatus;
                    existingRecord.likedAt = new Date();
                    return await existingRecord.save();
                }
            } else {
                const record = await EventLike.create({
                    event_id: eventId,
                    user_id: userId,
                    is_liked: likedStatus,
                });
                return record.toObject();
            }
        } catch (err) {
            throw err;
        }
    }

    async toggleFeedbackLike(userId, feedbackId, likedStatus) {
        try {
            const existingRecord = await FeedbackLike.findOne({
                feedback_id: feedbackId,
                user_id: userId,
            }); // BSON data

            if (existingRecord) {
                if (existingRecord.is_liked === Boolean(likedStatus)) {
                    return await existingRecord.deleteOne();
                } else {
                    existingRecord.is_liked = likedStatus;
                    existingRecord.likedAt = new Date();
                    return await existingRecord.save();
                }
            } else {
                const record = await FeedbackLike.create({
                    feedback_id: feedbackId,
                    user_id: userId,
                    is_liked: likedStatus,
                });
                return record.toObject();
            }
        } catch (err) {
            throw err;
        }
    }
}

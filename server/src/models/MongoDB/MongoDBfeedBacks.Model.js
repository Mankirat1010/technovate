// import { Icomments } from '../../interfaces/comment.Interface.js';
// import { Comment } from '../../schemas/MongoDB/index.js';

// export class MongoDBcomments extends Icomments {
//     async getComments(postId, userId, orderBy) {
//         try {
//             const pipeline = [
//                 { $match: { post_id: postId } },
//                 {
//                     $lookup: {
//                         from: 'users',
//                         localField: 'user_id',
//                         foreignField: 'user_id',
//                         as: 'owner',
//                         pipeline: [
//                             {
//                                 $project: {
//                                     user_id: 1,
//                                     user_name: 1,
//                                     user_firstName: 1,
//                                     user_lastName: 1,
//                                     user_avatar: 1,
//                                 },
//                             },
//                         ],
//                     },
//                 },
//                 { $unwind: '$owner' },
//                 {
//                     $lookup: {
//                         from: 'commentlikes',
//                         localField: 'comment_id',
//                         foreignField: 'comment_id',
//                         as: 'likes',
//                         pipeline: [{ $match: { is_liked: true } }],
//                     },
//                 },
//                 {
//                     $lookup: {
//                         from: 'commentlikes',
//                         localField: 'comment_id',
//                         foreignField: 'comment_id',
//                         as: 'dislikes',
//                         pipeline: [{ $match: { is_liked: false } }],
//                     },
//                 },
//                 {
//                     $addFields: {
//                         likes: { $size: '$likes' },
//                         dislikes: { $size: '$dislikes' },
//                         isLiked: userId
//                             ? {
//                                   $cond: {
//                                       if: { $in: [userId, '$likes.user_id'] },
//                                       then: 1,
//                                       else: {
//                                           $cond: {
//                                               if: {
//                                                   $in: [
//                                                       userId,
//                                                       '$dislikes.user_id',
//                                                   ],
//                                               },
//                                               then: 0,
//                                               else: -1,
//                                           },
//                                       },
//                                   },
//                               }
//                             : -1,
//                     },
//                 },
//                 { $sort: { comment_createdAt: orderBy === 'DESC' ? -1 : 1 } },
//             ];

//             return await Comment.aggregate(pipeline);
//         } catch (err) {
//             throw err;
//         }
//     }

//     async commentExistance(commentId) {
//         try {
//             return await Comment.findOne({ comment_id: commentId }).lean();
//         } catch (err) {
//             throw err;
//         }
//     }

//     async createComment(userId, postId, commentContent) {
//         try {
//             const comment = await Comment.create({
//                 user_id: userId,
//                 post_id: postId,
//                 comment_content: commentContent,
//             });
//             return comment.toObject();
//         } catch (err) {
//             throw err;
//         }
//     }

//     async deleteComment(commentId) {
//         try {
//             return await Comment.findOneAndDelete({
//                 comment_id: commentId,
//             }).lean();
//         } catch (err) {
//             throw err;
//         }
//     }

//     async editComment(commentId, commentContent) {
//         try {
//             return await Comment.findOneAndUpdate(
//                 { comment_id: commentId },
//                 {
//                     $set: {
//                         comment_content: commentContent,
//                     },
//                 },
//                 { new: true }
//             ).lean();
//         } catch (err) {
//             throw err;
//         }
//     }
// }
import { IfeedBacks } from '../../interfaces/feedback.Interface.js';
export class MongoDBfeedBacks extends IfeedBacks {
    async getFeedbacks(eventId, userId, orderBy) {
        try {
            const pipeline = [
                { $match: { event_id: eventId } },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'user_id',
                        foreignField: 'user_id',
                        as: 'owner',
                        pipeline: [
                            {
                                $project: {
                                    user_id: 1,
                                    user_name: 1,
                                    user_firstName: 1,
                                    user_lastName: 1,
                                    user_avatar: 1,
                                },
                            },
                        ],
                    },
                },
                { $unwind: '$owner' },
                {
                    $lookup: {
                        from: 'feedbacklikes',
                        localField: 'feedback_id',
                        foreignField: 'feedback_id',
                        as: 'likes',
                        pipeline: [{ $match: { is_liked: true } }],
                    },
                },
                {
                    $lookup: {
                        from: 'feedbacklikes',
                        localField: 'feedback_id',
                        foreignField: 'feedback_id',
                        as: 'dislikes',
                        pipeline: [{ $match: { is_liked: false } }],
                    },
                },
                {
                    $addFields: {
                        likes: { $size: '$likes' },
                        dislikes: { $size: '$dislikes' },
                        isLiked: userId
                            ? {
                                  $cond: {
                                      if: { $in: [userId, '$likes.user_id'] },
                                      then: 1,
                                      else: {
                                          $cond: {
                                              if: {
                                                  $in: [
                                                      userId,
                                                      '$dislikes.user_id',
                                                  ],
                                              },
                                              then: 0,
                                              else: -1,
                                          },
                                      },
                                  },
                              }
                            : -1,
                    },
                },
                { $sort: { feedback_createdAt: orderBy === 'DESC' ? -1 : 1 } },
            ];

            return await Feedback.aggregate(pipeline);
        } catch (err) {
            throw err;
        }
    }

    async feedbackExistance(feedbackId) {
        try {
            return await Feedback.findOne({ feedback_id: feedbackId }).lean();
        } catch (err) {
            throw err;
        }
    }

    async createFeedback(userId, eventId, feedbackContent) {
        try {
            const feedback = await Feedback.create({
                user_id: userId,
                event_id: eventId,
                feedback_content: feedbackContent,
            });
            return feedback.toObject();
        } catch (err) {
            throw err;
        }
    }

    async deleteFeedback(feedbackId) {
        try {
            return await Feedback.findOneAndDelete({
                feedback_id: feedbackId,
            }).lean();
        } catch (err) {
            throw err;
        }
    }

    async editFeedback(feedbackId, feedbackContent) {
        try {
            return await Feedback.findOneAndUpdate(
                { feedback_id: feedbackId },
                {
                    $set: {
                        feedback_content: feedbackContent,
                    },
                },
                { new: true }
            ).lean();
        } catch (err) {
            throw err;
        }
    }
}

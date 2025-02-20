import { model, Schema } from 'mongoose';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';

const eventLikeSchema = new Schema({
    event_id: {
        type: String,
        ref: 'event',
        required: true,
        index: true,
    },
    user_id: {
        type: String,
        ref: 'User',
        required: true,
        index: true,
    },
    is_liked: {
        type: Boolean,
        required: true,
    },
    likedAt: {
        type: Date,
        default: Date.now(),
    },
});

const feedbackLikeSchema = new Schema({
    feedback_id: {
        type: String,
        ref: 'Comment',
        required: true,
        index: true,
    },
    user_id: {
        type: String,
        ref: 'User',
        required: true,
    },
    is_liked: {
        type: Boolean,
        required: true,
    },
    likedAt: {
        type: Date,
        default: Date.now(),
    },
});

eventLikeSchema.plugin(aggregatePaginate);

const EventLike = model('EventLike', eventLikeSchema);
const FeedBackLike = model('FeedBackLike', feedbackLikeSchema);

export { EventLike, FeedBackLike };

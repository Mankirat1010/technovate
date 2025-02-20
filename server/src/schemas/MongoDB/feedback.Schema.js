import { model, Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

const feedBackSchema = new Schema({
    feedBack_id: {
        type: String,
        unique: true,
        required: true,
        default: () => uuid(),
    },
    user_id: {
        type: String,
        ref: 'User',
        required: true,
    },
    event_id: {
        type: String,
        ref: 'Event',
        required: true,
        index: true,
    },
    feedBack_content: {
        type: String,
        required: true,
    },
    feedBack_createdAt: {
        type: Date,
        default: Date.now(),
    },
});

export const FeedBack = model('FeedBack', feedBackSchema);

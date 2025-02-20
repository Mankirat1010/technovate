import { model, Schema } from 'mongoose';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';
import { v4 as uuid } from 'uuid';

const userSchema = new Schema({
    user_id: {
        type: String,
        default: () => uuid(),
        unique: true,
        required: true,
        index: true,
    },
    user_name: {
        type: String,
        unique: true,
        required: true,
        index: true,
    },
    user_firstName: {
        type: String,
        required: true,
    },
    user_lastName: {
        type: String,
    },
    user_bio: {
        type: String,
        default: '',
    },
    user_avatar: {
        type: String,
        required: true,
    },
    user_coverImage: {
        type: String,
    },
    user_email: {
        type: String,
        unique: true,
        required: true,
    },
    user_password: {
        type: String,
        required: true,
    },
    organization_name: {
        type: String,
        index: true,
        default: '',
    },
    event_id: {
        type: String,
        index: true,
        ref: 'Event',
        default: '',
    },
    user_createdAt: {
        type: Date,
        default: Date.now(),
    },
    refresh_token: {
        type: String,
        default: '',
    },
});

const savedEventSchema = new Schema({
    post_id: {
        type: String,
        required: true,
        ref: 'Post',
    },
    user_id: {
        type: String,
        required: true,
        ref: 'User',
        index: true,
    },
    savedAt: {
        type: Date,
        default: Date.now(),
    },
});

const watchHistorySchema = new Schema({
    post_id: {
        type: String,
        required: true,
        ref: 'Post',
    },
    user_id: {
        type: String,
        required: true,
        ref: 'User',
        index: true,
    },
    watchedAt: {
        type: Date,
        default: Date.now(),
    },
});

userSchema.plugin(aggregatePaginate);
savedEventSchema.plugin(aggregatePaginate);
watchHistorySchema.plugin(aggregatePaginate);

const User = model('User', userSchema);
const SavedEvent = model('SavedEvent', savedEventSchema);
const WatchHistory = model('WatchHistory', watchHistorySchema);

export { User, SavedEvent, WatchHistory };

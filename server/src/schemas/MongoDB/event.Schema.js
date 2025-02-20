import { model, Schema } from 'mongoose';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';
import { v4 as uuid } from 'uuid';

const eventSchema = new Schema({
    event_id: {
        type: String,
        unique: true,
        required: true,
        index: true,
        default: () => uuid(),
    },
    event_image: {
        type: String,
        required: true,
    },
    event_title: {
        type: String,
        required: true,
    },
    event_content: {
        type: String,
        required: true,
    },
    event_ownerId: {
        type: String,
        ref: 'User',
        required: true,
    },
    event_visibility: {
        type: Boolean,
        default: true,
        required: true,
    },
    event_duration: {
        type: String,
        required: true,
    },
    event_venue: {
        type: String,
        required: true,
    },
    event_date: {
        type: Date,
        required: true,
        index: true,
    },
    event_category: {
        type: String,
        ref: 'Category',
        required: true,
    },
    event_createdAt: {
        type: Date,
        default: Date.now(),
    },
    event_updatedAt: {
        type: Date,
        default: Date.now(),
    },
});

const eventViewSchema = new Schema({
    event_id: {
        type: String,
        ref: 'Event',
        required: true,
        index: true,
    },
    user_identifier: {
        type: String,
        ref: 'User',
        required: true,
    },
});

eventSchema.plugin(aggregatePaginate);

const Event = model('Event', eventSchema);
const EventView = model('EventView', eventViewSchema);

export { Event, EventView };

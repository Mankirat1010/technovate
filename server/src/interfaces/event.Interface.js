export class Ievents {
    async getRandomEvents(limit, orderBy, page, category) {
        throw new Error('Method getRandomEvents is not overwritten.');
    }

    async getEvents(channelId, limit, orderBy, page, category) {
        throw new Error('Method getEvents is not overwritten.');
    }

    async getEvent(eventId, userId) {
        throw new Error('Method getEvent is not overwritten.');
    }

    async createEvent({
        eventId,
        userId,
        title,
        content,
        categoryId,
        eventImage,
    }) {
        throw new Error('Method createEvent is not overwritten');
    }

    async deleteEvent(eventId) {
        throw new Error('Method deleteEvent is not overwritten.');
    }

    async updateEventViews(eventId, userIdentifier) {
        throw new Error('Method updateEventViews is not overwritten.');
    }

    async updateEventDetails({ eventId, title, content, categoryId }) {
        throw new Error('Method updateEventDetails is not overwritten.');
    }

    async updateeventImage(eventId, eventImage) {
        throw new Error('Method updateeventImage is not overwritten.');
    }

    async toggleEventVisibility(eventId, visibility) {
        throw new Error('Method toggleEventVisibility is not overwritten.');
    }

    async toggleSaveEvent(userId, eventId) {
        throw new Error('Method toggleSaveEvent is not overwritten.');
    }

    async getSavedEvents(userId, orderBy, limit, page) {
        throw new Error('Method getSavedEvents is not overwritten.');
    }
}

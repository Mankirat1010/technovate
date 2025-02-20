export class Ilikes {
    async getLikedEvents(userId, orderBy, limit, page) {
        throw new Error('Method getLikedEvents not overwritten.');
    }

    async toggleEventLike(userId, eventId, likedStatus) {
        throw new Error('Method toggleEventLike not overwritten.');
    }

    async toggleFeedBackLike(userId, feedBackId, likedStatus) {
        throw new Error('Method toggleFeedBackLike not overwritten.');
    }
}

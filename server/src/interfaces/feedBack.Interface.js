export class IfeedBacks {
    async getfeedBacks(eventId, userId, orderBy) {
        throw new Error('Method getfeedBacks not overwritten.');
    }

    async getfeedBack(feedBackId, userId) {
        throw new Error('Method getfeedBack not overwritten.');
    }

    async createfeedBack(feedBackId, userId, eventId, feedBackContent) {
        throw new Error('Method createfeedBack not overwritten.');
    }

    async deletefeedBack(feedBackId) {
        throw new Error('Method deletefeedBack not overwritten.');
    }

    async editfeedBack(feedBackId, feedbackContent) {
        throw new Error('Method editfeedBack not overwritten.');
    }
}

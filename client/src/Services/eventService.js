class EventService {
    async getRandomEvents(
        signal,
        page = 1,
        limit = 10,
        category = '',
        orderBy = 'desc'
    ) {
        try {
            const res = await fetch(
                `/api/events/all?limit=${limit}&orderBy=${orderBy}&page=${page}&category=${category}`,
                {
                    method: 'GET',
                    signal,
                }
            );

            const data = await res.json();
            console.log(data);

            if (res.status === 500) {
                throw new Error(data.message);
            }

            return data;
        } catch (err) {
            if (err.name === 'AbortError') {
                console.log('get random events request aborted.');
            } else {
                console.error('error in getRandomevents service', err);
                throw err;
            }
        }
    }

    async getEvents(signal, channelId, limit = 10, page = 1, orderBy = 'desc') {
        try {
            const res = await fetch(
                `/api/events/channel/${channelId}?limit=${limit}&orderBy=${orderBy}&page=${page}`,
                { signal, method: 'GET' }
            );

            const data = await res.json();
            console.log(data);

            if (res.status === 500) {
                throw new Error(data.message);
            }
            return data;
        } catch (err) {
            if (err.name === 'AbortError') {
                console.log('get events request aborted.');
            } else {
                console.error('error in getevents service', err);
                throw err;
            }
        }
    }

    async getEvent(signal, postId) {
        try {
            const res = await fetch(`/api/events/event/${postId}`, {
                method: 'GET',
                credentials: 'include',
                signal,
            });

            const data = await res.json();
            console.log(data);

            if (res.status === 500) {
                throw new Error(data.message);
            }
            return data;
        } catch (err) {
            if (err.name === 'AbortError') {
                console.log('get post request aborted.');
            } else {
                console.error('error in getPost service', err);
                throw err;
            }
        }
    }

    async updateEventDetails(inputs, postId) {
        try {
            const res = await fetch(`/api/events/details/${postId}`, {
                method: 'PATCH',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(inputs), // title, content & category
            });

            const data = await res.json();
            console.log(data);

            if (res.status === 500) {
                throw new Error(data.message);
            }
            return data;
        } catch (err) {
            console.error('error in updatePostDetails service', err);
            throw err;
        }
    }

    async updateEventImage(postImage, postId) {
        try {
            const formData = new FormData();
            formData.append('postImage', postImage);

            const res = await fetch(`/api/events/image/${postId}`, {
                method: 'PATCH',
                credentials: 'include',
                body: formData,
            });

            const data = await res.json();
            console.log(data);

            if (res.status === 500) {
                throw new Error(data.message);
            }
            return data;
        } catch (err) {
            console.error('error in updatePostImage service', err);
            throw err;
        }
    }

    async deleteEvent(postId) {
        try {
            const res = await fetch(`/api/events/delete/${postId}`, {
                method: 'DELETE',
                credentials: 'include',
            });

            const data = await res.json();
            console.log(data);

            if (res.status === 500) {
                throw new Error(data.message);
            }
            return data;
        } catch (err) {
            console.error('error in deletePost service', err);
            throw err;
        }
    }

    async addEvent(inputs) {
        try {
            const formData = new FormData();
            Object.entries(inputs).forEach(([key, value]) => {
                formData.append(key, value);
            });

            const res = await fetch('/api/events/add', {
                method: 'POST',
                credentials: 'include',
                body: formData,
            });

            const data = await res.json();
            console.log(data);

            if (res.status === 500) {
                throw new Error(data.message);
            }
            return data;
        } catch (err) {
            console.error('error in addPost service', err);
            throw err;
        }
    }

    async toggleEventVisibility(postId) {
        try {
            const res = await fetch(`/api/events/visibility/${postId}`, {
                method: 'PATCH',
                credentials: 'include',
            });

            const data = await res.json();
            console.log(data);

            if (res.status === 500) {
                throw new Error(data.message);
            }
            return data;
        } catch (err) {
            console.error('error in togglePostVisibility service', err);
            throw err;
        }
    }

    async getSavedEvents(signal, limit = 10, page = 1, orderBy = 'desc') {
        try {
            const res = await fetch(
                `/api/events/saved?orderBy=${orderBy}&limit=${limit}&page=${page}`,
                {
                    method: 'GET',
                    credentials: 'include',
                    signal,
                }
            );

            const data = await res.json();
            console.log(data);

            if (res.status === 500) {
                throw new Error(data.message);
            }
            return data;
        } catch (err) {
            if (err.name === 'AbortError') {
                console.log('get saved events request aborted.');
            } else {
                console.error('error in getSavedevents service', err);
                throw err;
            }
        }
    }

    async toggleSaveEvent(eventId) {
        try {
            const res = await fetch(`/api/events/toggle-save/${eventId}`, {
                method: 'POST',
                credentials: 'include',
            });

            const data = await res.json();
            console.log(data);

            if (res.status === 500) {
                throw new Error(data.message);
            }
            return data;
        } catch (err) {
            console.error('error in toggleSaveEvent service', err);
            throw err;
        }
    }
}

export const eventService = new EventService();

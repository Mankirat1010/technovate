class ChatService {
    async getMyChats(signal) {
        try {
            const res = await fetch(`/api/chats`, {
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
                console.log('get chats request aborted.');
            } else {
                console.error('error in getChats service', err);
                throw err;
            }
        }
    }
    async getMyFriends(signal) {
        try {
            const res = await fetch(`/api/chats/friends`, {
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
                console.log('get friends request aborted.');
            } else {
                console.error('error in getFriends service', err);
                throw err;
            }
        }
    }

    async getChatDetails(signal, chatId) {
        try {
            const res = await fetch(`/api/chats/${chatId}`, {
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
                console.log('get chat request aborted.');
            } else {
                console.error('error in getChat service', err);
                throw err;
            }
        }
    }

    async getMessages(signal, chatId, page, limit) {
        try {
            const res = await fetch(
                `/api/messages/${chatId}?page=${page}&limit=${limit}`,
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
                console.log('get messages request aborted.');
            } else {
                console.error('error in getMessages service', err);
                throw err;
            }
        }
    }

    async sendMessage(chatId, message) {
        try {
            let body, headers;

            if (message.attachments.length) {
                const formData = new FormData();
                message.attachments.forEach((file) => {
                    formData.append(`attachments`, file); // Appending each file can't send array directly
                });
                formData.append('text', message.text);
                body = formData; // FormData instance
            } else {
                body = JSON.stringify({ text: message.text });
                headers = { 'Content-Type': 'application/json' };
            }

            const res = await fetch(`/api/messages/${chatId}`, {
                method: 'POST',
                credentials: 'include',
                headers,
                body,
            });

            const data = await res.json();
            console.log(data);

            if (res.status === 500) {
                throw new Error(data.message);
            }
            return data;
        } catch (err) {
            console.error('Error in sendMessage service', err);
            throw err;
        }
    }

    async removeMember(chatId, userId) {
        try {
            const res = await fetch(
                `/api/chats/groups/members/remove/${chatId}/${userId}`,
                {
                    method: 'PATCH',
                    credentials: 'include',
                }
            );

            const data = await res.json();
            console.log(data);

            if (res.status === 500) {
                throw new Error(data.message);
            }
            return data;
        } catch (err) {
            console.error('Error in removeMember service', err);
            throw err;
        }
    }

    async addMembers(chatId, members) {
        try {
            const res = await fetch(`/api/chats/groups/members/add/${chatId}`, {
                method: 'PATCH',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ members }),
            });

            const data = await res.json();
            console.log(data);

            if (res.status === 500) {
                throw new Error(data.message);
            }
            return data;
        } catch (err) {
            console.error('Error in addMembers service', err);
            throw err;
        }
    }

    async makeAdmin(chatId, userId) {
        try {
            const res = await fetch(
                `/api/chats/groups/members/admin/${chatId}/${userId}`,
                {
                    method: 'PATCH',
                    credentials: 'include',
                }
            );

            const data = await res.json();
            console.log(data);

            if (res.status === 500) {
                throw new Error(data.message);
            }
            return data;
        } catch (err) {
            console.error('Error in makeAdmin service', err);
            throw err;
        }
    }
}

export const chatService = new ChatService();

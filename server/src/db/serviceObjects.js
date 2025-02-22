import {
    MongoDBusers,
    MongoDBevents,
    MongoDBlikes,
    MongoDBfollowers,
    MongoDBfeedBacks,
    MongoDBcategories,
    MongoDBchats,
    MongoDBmessages,
    MongoDBonlineUsers,
    MongoDBrequests,
} from '../models/MongoDB/index.js';

const serviceMap = {
    MongoDB: {
        users: MongoDBusers,
        events: MongoDBevents,
        likes: MongoDBlikes,
        feedBacks: MongoDBfeedBacks,
        followers: MongoDBfollowers,
        categories: MongoDBcategories,
        chats: MongoDBchats,
        messages: MongoDBmessages,
        onlineUsers: MongoDBonlineUsers,
        requests: MongoDBrequests,
    },
};

export function getServiceObject(serviceType) {
    try {
        const dbType = process.env.DATABASE_TYPE;
        if (!serviceMap[dbType]) {
            throw new Error('Unsupported DB Type');
        }

        const ServiceClass = serviceMap[dbType][serviceType];
        if (!ServiceClass) {
            throw new Error('Unsupported service type');
        }

        return new ServiceClass();
    } catch (err) {
        console.log({
            message: 'Something went wrong while generating service object',
            error: err,
        });
        process.exit(1);
    }
}

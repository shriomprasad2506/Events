const { client, ObjectId } = require('../config/db');

const db = client.db();

const Event = {
    async create(eventData) {
        const data = {
            ...eventData,
            createdAt: new Date()
        };
        const result = await db.collection('events').insertOne(data);
        return result;
    },

    async findAll(limit, skip) {
        const events = await db.collection('events')
            .find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit))
            .toArray();
        return events;
    },

    async findById(id) {
        return await db.collection('events').findOne({ _id: new ObjectId(id) });
    },

    async findByIdAndUpdate(id, updateData) {
        const result = await db.collection('events').findOneAndUpdate(
            { _id: new ObjectId(id) },
            { $set: updateData },
            { returnDocument: 'after' }
        );
        return result.value; 
    },

    async findByIdAndDelete(id) {
        const result = await db.collection('events').findOneAndDelete({ _id: new ObjectId(id) });
        return result.value; 
    },

    async search(query, limit, skip) {
        const searchQuery = query ? { name: { $regex: query, $options: 'i' } } : {};
        return await db.collection('events')
            .find(searchQuery)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit))
            .toArray();
    },

    async countDocuments(query = {}) {
        return await db.collection('events').countDocuments(query);
    }
};

module.exports = Event;

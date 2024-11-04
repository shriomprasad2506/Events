const Event = require('../models/Event');

async function getEvent(req, res) {
    try {
        const eventId = req.query.id;
        if (eventId) {
            const event = await Event.findById(eventId);
            if (!event) {
                return res.status(404).json({ message: "Event not found" });
            }
            return res.status(200).json(event);
        } 
        
        const { limit = 5, page = 1, search } = req.query;
        const skip = (page - 1) * limit;
        let events, totalEvents;

        if (search) {
            events = await Event.search(search, limit, skip);
            totalEvents = await Event.countDocuments({ name: { $regex: search, $options: 'i' } });
        } else if(limit && page) {
            events = await Event.findAll(limit, skip);
            totalEvents = await Event.countDocuments({});
        } else{
            events = await Event.find({});
            totalEvents = events.length;
        }

        return res.status(200).json({ events, totalEvents });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error fetching events" });
    }
}

async function createEvent(req, res) {
    try {
        const imageFile = req.files['image'] ? req.files['image'][0] : null;
        const iconFile = req.files['icon'] ? req.files['icon'][0] : null;

        let eventData = {
            ...req.body,
            image: imageFile ? imageFile.path : undefined,
            icon: iconFile ? iconFile.path : undefined,
        };

        const event = await Event.create(eventData);
        return res.status(201).json(event);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error creating event", error: error.message });
    }
}

async function updateEvent(req, res) {
    try {
        const { id } = req.params;
        const imageFile = req.files['image'] ? req.files['image'][0] : null;
        const iconFile = req.files['icon'] ? req.files['icon'][0] : null;

        let {_id,...updateData}=req.body
        console.log(req.body)
        if(imageFile){
            updateData={
                ...updateData,
                image:imageFile.path
            }
        }
        if(iconFile){
            updateData={
                ...updateData,
                icon:iconFile.path
            }
        }

        const updatedEvent = await Event.findByIdAndUpdate(id, updateData);
        if (!updatedEvent) {
            return res.status(404).json({ message: "Event not found" });
        }

        return res.status(200).json(updatedEvent);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error updating event" });
    }
}

async function deleteEvent(req, res) {
    try {
        const eventId = req.params.id;
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }
        await Event.findByIdAndDelete(eventId);
        return res.status(200).json({ message: "Event deleted successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error deleting event" });
    }
}

module.exports = { createEvent, getEvent, updateEvent, deleteEvent };

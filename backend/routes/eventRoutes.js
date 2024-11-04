const express = require('express');
const { createEvent, getEvent, updateEvent, deleteEvent } = require('../controllers/eventControllers');
const upload = require('../middleware/upload');

const router = express.Router();

router.get('/', getEvent)
router.post('/', upload.fields([{ name: 'image', maxCount: 1 }, { name: 'icon', maxCount: 1 }]), createEvent);
router.put('/:id', upload.fields([{ name: 'image', maxCount: 1 }, { name: 'icon', maxCount: 1 }]), updateEvent);
router.delete('/:id', deleteEvent);

module.exports = router;

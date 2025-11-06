const express = require('express');
const Note = require('../models/Note');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { search, archived, trashed } = req.query;
    const query = { 
      userId: req.userId,
      archived: archived === 'true',
      trashed: trashed === 'true'
    };
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }
    const notes = await Note.find(query).sort({ pinned: -1, createdAt: -1 });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const note = new Note({ ...req.body, userId: req.userId });
    await note.save();
    res.status(201).json(note);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true }
    );
    res.json(note);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { permanent } = req.query;
    if (permanent === 'true') {
      await Note.findOneAndDelete({ _id: req.params.id, userId: req.userId });
      res.json({ message: 'Note permanently deleted' });
    } else {
      await Note.findOneAndUpdate(
        { _id: req.params.id, userId: req.userId },
        { trashed: true, deletedAt: new Date() }
      );
      res.json({ message: 'Note moved to trash' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

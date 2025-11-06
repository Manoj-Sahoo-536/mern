const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  pinned: { type: Boolean, default: false },
  color: { type: String, default: 'default' },
  archived: { type: Boolean, default: false },
  trashed: { type: Boolean, default: false },
  deletedAt: { type: Date },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Note', noteSchema);

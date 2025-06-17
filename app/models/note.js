import mongoose from 'mongoose'

const NoteSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  summary: { type: String, required: true },
  place: { type: String, required: true },
  image: { type: String, required: true },
  content: { type: String, required: true },
  status: { type: String, enum: ['pending', 'approved'], default: 'pending' },
}, { timestamps: true })

export default mongoose.models.Note || mongoose.model('Note', NoteSchema) 
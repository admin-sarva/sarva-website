import mongoose from 'mongoose'

const SpotSchema = new mongoose.Schema({
  name: String,
  image: String,
  preview: String,
  description: String,
  images: [String],
}, { _id: false })

const PlaceSchema = new mongoose.Schema(
  {
    name: String,
    slug: { type: String, unique: true },
    title: String,
    subtitle: String,
    heroImage: String,
    quote: String,
    description: [String],
    images: [String],
    spots: [SpotSchema],
    caption: String,
    image: String,
  },
  { timestamps: true }
)

export default mongoose.models.Place || mongoose.model('Place', PlaceSchema) 
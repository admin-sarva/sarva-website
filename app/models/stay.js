import mongoose from 'mongoose'

const StaySchema = new mongoose.Schema(
  {
    name: String,
    slug: { type: String, unique: true },
    subtitle: String,
    description: [String],
    place: String,
    type: String,
    tags: [String],
    pricePerNight: Number,
    rating: Number,
    bestFor: [String],
    videoUrl: String,
    heroImage: String,
    images: [String],
    amenities: [String],
    mapEmbedUrl: String,
  },
  { timestamps: true }
)

export default mongoose.models.Stay || mongoose.model('Stay', StaySchema)

import fs from 'node:fs'
import mongoose from 'mongoose'
import Place from '../app/models/place.js'
import Note from '../app/models/note.js'

function loadEnv() {
  for (const file of ['.env.local', '.env']) {
    if (!fs.existsSync(file)) continue
    for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
      const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/)
      if (!match) continue
      const [, key, rawValue] = match
      if (!process.env[key]) process.env[key] = rawValue.replace(/^['"]|['"]$/g, '')
    }
  }
}

function countPlaceImages(place) {
  const galleryCount = Array.isArray(place.images) ? place.images.length : 0
  const spots = Array.isArray(place.spots) ? place.spots : []
  const spotMainCount = spots.filter((spot) => Boolean(spot.image)).length
  const spotGalleryCount = spots.reduce((total, spot) => {
    return total + (Array.isArray(spot.images) ? spot.images.length : 0)
  }, 0)

  return {
    name: place.name,
    slug: place.slug,
    placeHero: place.heroImage ? 1 : 0,
    placeCardImage: place.image ? 1 : 0,
    placeGallery: galleryCount,
    spots: spots.length,
    spotMainImages: spotMainCount,
    spotGalleryImages: spotGalleryCount,
    totalSlots: (place.heroImage ? 1 : 0) + (place.image ? 1 : 0) + galleryCount + spotMainCount + spotGalleryCount,
  }
}

loadEnv()
if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI is missing')

await mongoose.connect(process.env.MONGODB_URI, { dbName: 'sarva', bufferCommands: false })

const [places, notes] = await Promise.all([
  Place.find({}).sort({ name: 1 }),
  Note.find({ status: 'approved' }).sort({ place: 1, title: 1 }),
])

const placeBreakdown = places.map(countPlaceImages)
const totals = placeBreakdown.reduce((acc, item) => {
  acc.placeHero += item.placeHero
  acc.placeCardImage += item.placeCardImage
  acc.placeGallery += item.placeGallery
  acc.spots += item.spots
  acc.spotMainImages += item.spotMainImages
  acc.spotGalleryImages += item.spotGalleryImages
  acc.totalPlaceAndSpotSlots += item.totalSlots
  return acc
}, {
  placeHero: 0,
  placeCardImage: 0,
  placeGallery: 0,
  spots: 0,
  spotMainImages: 0,
  spotGalleryImages: 0,
  totalPlaceAndSpotSlots: 0,
})

const noteImageSlots = notes.filter((note) => Boolean(note.image)).length

console.log(JSON.stringify({
  places: places.length,
  approvedWanderNotes: notes.length,
  totals: {
    ...totals,
    wanderNoteImages: noteImageSlots,
    totalExistingImageSlots: totals.totalPlaceAndSpotSlots + noteImageSlots,
  },
  placeBreakdown,
  noteBreakdown: notes.map((note) => ({
    title: note.title,
    slug: note.slug,
    place: note.place,
    hasImage: Boolean(note.image),
  })),
}, null, 2))

await mongoose.disconnect()

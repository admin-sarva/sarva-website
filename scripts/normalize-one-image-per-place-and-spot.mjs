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

loadEnv()
if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI is missing')

await mongoose.connect(process.env.MONGODB_URI, { dbName: 'sarva', bufferCommands: false })

const places = await Place.find({}).sort({ name: 1 })
const placeImageByName = new Map()

for (const place of places) {
  const placeImage = place.heroImage || place.image || place.images?.[0]
  const spots = (place.spots || []).map((spot) => {
    const plainSpot = typeof spot.toObject === 'function' ? spot.toObject() : spot
    const spotImage = plainSpot.image || plainSpot.images?.[0]
    return {
      ...plainSpot,
      image: spotImage,
      images: spotImage ? [spotImage] : [],
    }
  })

  if (placeImage) placeImageByName.set(String(place.name).toLowerCase(), placeImage)

  await Place.updateOne(
    { _id: place._id },
    {
      $set: {
        heroImage: placeImage,
        image: placeImage,
        images: placeImage ? [placeImage] : [],
        spots,
      },
    }
  )
}

const notes = await Note.find({ status: 'approved' })
let notesUpdated = 0

for (const note of notes) {
  const image = placeImageByName.get(String(note.place || '').toLowerCase())
  if (!image) continue
  await Note.updateOne({ _id: note._id }, { $set: { image } })
  notesUpdated += 1
}

console.log(`Normalized places: ${places.length}`)
console.log(`Wander notes pointed to matching place images: ${notesUpdated}`)

await mongoose.disconnect()

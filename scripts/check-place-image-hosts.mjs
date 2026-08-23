import fs from 'node:fs'
import mongoose from 'mongoose'
import Place from '../app/models/place.js'

function loadEnv() {
  for (const file of ['.env.local', '.env']) {
    if (!fs.existsSync(file)) continue

    const env = fs.readFileSync(file, 'utf8')
    for (const line of env.split(/\r?\n/)) {
      const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/)
      if (!match) continue

      const [, key, rawValue] = match
      const value = rawValue.replace(/^['"]|['"]$/g, '')
      if (!process.env[key]) process.env[key] = value
    }
  }
}

function collectImageUrls(place) {
  const urls = []
  if (place.heroImage) urls.push(place.heroImage)
  if (place.image) urls.push(place.image)
  if (Array.isArray(place.images)) urls.push(...place.images)
  if (Array.isArray(place.spots)) {
    for (const spot of place.spots) {
      if (spot.image) urls.push(spot.image)
      if (Array.isArray(spot.images)) urls.push(...spot.images)
    }
  }
  return urls
}

loadEnv()

await mongoose.connect(process.env.MONGODB_URI, {
  dbName: 'sarva',
  bufferCommands: false,
})

const places = await Place.find({})
const report = places.map((place) => {
  const urls = collectImageUrls(place)
  const nonCloudinary = urls.filter((url) => !url.includes('res.cloudinary.com'))
  return {
    name: place.name,
    slug: place.slug,
    imageCount: urls.length,
    nonCloudinary,
  }
})

console.log(JSON.stringify(report, null, 2))

await mongoose.disconnect()

import fs from 'node:fs'
import mongoose from 'mongoose'
import Place from '../app/models/place.js'

const CLOUDINARY_CLOUD_NAME = 'dlk6lycdy'
const CLOUDINARY_UPLOAD_PRESET = 'sarva_uploads'
const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`

const photos = (slug) => [1, 2, 3, 4].map((index) =>
  `https://picsum.photos/seed/sarva-${slug}-${index}/1600/900`
)

const publicSources = {
  agumbe: photos('agumbe'),
  coorg: photos('coorg'),
  sakleshpur: photos('sakleshpur'),
  madikeri: photos('madikeri'),
  ooty: photos('ooty'),
  wayanad: photos('wayanad'),
  chikkamagalur: photos('chikkamagalur'),
  udupi: photos('udupi'),
  gokarna: photos('gokarna'),
}

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

async function uploadToCloudinary(sourceUrl, cache) {
  if (cache.has(sourceUrl)) return cache.get(sourceUrl)

  const body = new FormData()
  body.append('file', sourceUrl)
  body.append('upload_preset', CLOUDINARY_UPLOAD_PRESET)

  const res = await fetch(CLOUDINARY_UPLOAD_URL, {
    method: 'POST',
    body,
  })
  const data = await res.json()

  if (!res.ok || !data.secure_url) {
    throw new Error(`Cloudinary upload failed for ${sourceUrl}: ${data.error?.message || res.statusText}`)
  }

  cache.set(sourceUrl, data.secure_url)
  console.log(`Uploaded ${sourceUrl}`)
  console.log(`     -> ${data.secure_url}`)
  return data.secure_url
}

function assignSpotImages(spots, urls) {
  if (!Array.isArray(spots)) return []

  return spots.map((spot, index) => ({
    ...(typeof spot.toObject === 'function' ? spot.toObject() : spot),
    image: urls[(index + 1) % urls.length],
    images: [
      urls[(index + 1) % urls.length],
      urls[(index + 2) % urls.length],
    ],
  }))
}

function existingCloudinaryUrls(place) {
  const urls = []
  for (const url of [place.heroImage, place.image, ...(place.images || [])]) {
    if (typeof url === 'string' && url.includes('res.cloudinary.com') && !urls.includes(url)) {
      urls.push(url)
    }
  }
  return urls
}

loadEnv()

if (!process.env.MONGODB_URI) {
  console.error('MONGODB_URI is missing. Add it to .env or .env.local before replacing images.')
  process.exit(1)
}

await mongoose.connect(process.env.MONGODB_URI, {
  dbName: 'sarva',
  bufferCommands: false,
})

const cache = new Map()
let updated = 0

for (const [slug, sources] of Object.entries(publicSources)) {
  const place = await Place.findOne({
    $or: [
      { slug },
      { slug: new RegExp(`^${slug}$`, 'i') },
      { name: new RegExp(`^${slug}$`, 'i') },
      ...(slug === 'agumbe' ? [{ name: /^Agumbe$/i }] : []),
      ...(slug === 'coorg' ? [{ name: /^Coorg$/i }] : []),
    ],
  })
  if (!place) {
    console.log(`Skipped missing place: ${slug}`)
    continue
  }

  const existingUrls = existingCloudinaryUrls(place)
  const cloudinaryUrls = existingUrls.length >= 4 ? existingUrls.slice(0, 4) : []

  if (cloudinaryUrls.length < 4) {
    for (const source of sources) {
      cloudinaryUrls.push(await uploadToCloudinary(source, cache))
    }
  }

  await Place.updateOne(
    { _id: place._id },
    {
      $set: {
        slug,
        heroImage: cloudinaryUrls[0],
        image: cloudinaryUrls[0],
        images: cloudinaryUrls,
        spots: assignSpotImages(place.spots, cloudinaryUrls),
      },
    }
  )

  updated += 1
  console.log(`Updated place image URLs: ${place.name} (${slug})`)
}

console.log(`Places updated: ${updated}`)
console.log(`Unique public source images uploaded: ${cache.size}`)

await mongoose.disconnect()

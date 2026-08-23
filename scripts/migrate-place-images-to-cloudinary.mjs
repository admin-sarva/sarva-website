import fs from 'node:fs'
import mongoose from 'mongoose'
import Place from '../app/models/place.js'

const CLOUDINARY_CLOUD_NAME = 'dlk6lycdy'
const CLOUDINARY_UPLOAD_PRESET = 'sarva_uploads'
const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`

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

function shouldMigrate(url) {
  return typeof url === 'string' && (
    url.includes('commons.wikimedia.org') ||
    url.includes('upload.wikimedia.org')
  )
}

async function uploadRemoteImage(url, cache) {
  if (!shouldMigrate(url)) return url
  if (cache.has(url)) return cache.get(url)

  const body = new FormData()
  body.append('file', url)
  body.append('upload_preset', CLOUDINARY_UPLOAD_PRESET)

  const res = await fetch(CLOUDINARY_UPLOAD_URL, {
    method: 'POST',
    body,
  })

  const data = await res.json()

  if (res.ok && data.secure_url) {
    cache.set(url, data.secure_url)
    console.log(`Uploaded: ${url}`)
    console.log(`      -> ${data.secure_url}`)
    return data.secure_url
  }

  console.log(`Remote upload failed, retrying as downloaded file: ${data.error?.message || res.statusText}`)
  const uploadedUrl = await uploadDownloadedImage(url)
  cache.set(url, uploadedUrl)
  return uploadedUrl
}

function filenameFromUrl(url) {
  const parsed = new URL(url)
  const pathParts = parsed.pathname.split('/')
  const raw = pathParts[pathParts.length - 1] || 'sarva-place-image.jpg'
  return decodeURIComponent(raw).replace(/[^a-zA-Z0-9._-]+/g, '-')
}

async function uploadDownloadedImage(url) {
  const imageRes = await fetch(url, {
    headers: {
      'User-Agent': 'SarvaHolidaysImageMigration/1.0',
      'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
    },
  })

  if (!imageRes.ok) {
    throw new Error(`Failed to download ${url}: ${imageRes.status} ${imageRes.statusText}`)
  }

  const contentType = imageRes.headers.get('content-type') || 'image/jpeg'
  const blob = new Blob([await imageRes.arrayBuffer()], { type: contentType })
  const body = new FormData()
  body.append('file', blob, filenameFromUrl(url))
  body.append('upload_preset', CLOUDINARY_UPLOAD_PRESET)

  const uploadRes = await fetch(CLOUDINARY_UPLOAD_URL, {
    method: 'POST',
    body,
  })

  const uploadData = await uploadRes.json()

  if (!uploadRes.ok || !uploadData.secure_url) {
    throw new Error(`Cloudinary file upload failed for ${url}: ${uploadData.error?.message || uploadRes.statusText}`)
  }

  console.log(`Uploaded downloaded file: ${url}`)
  console.log(`                  -> ${uploadData.secure_url}`)
  return uploadData.secure_url
}

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function uploadWithPoliteDelay(url, cache) {
  const result = await uploadRemoteImage(url, cache)
  if (shouldMigrate(url)) await wait(750)
  return result
}

async function migrateUrl(url, cache) {
  if (!shouldMigrate(url)) return url
  return uploadWithPoliteDelay(url, cache)
}

async function migratePlace(place, cache) {
  let changed = false
  const next = place.toObject()

  for (const field of ['heroImage', 'image']) {
    const migrated = await migrateUrl(next[field], cache)
    if (migrated !== next[field]) {
      next[field] = migrated
      changed = true
    }
  }

  if (Array.isArray(next.images)) {
    const images = []
    for (const url of next.images) {
      const migrated = await migrateUrl(url, cache)
      images.push(migrated)
      if (migrated !== url) changed = true
    }
    next.images = images
  }

  if (Array.isArray(next.spots)) {
    for (const spot of next.spots) {
      const migratedSpotImage = await migrateUrl(spot.image, cache)
      if (migratedSpotImage !== spot.image) {
        spot.image = migratedSpotImage
        changed = true
      }

      if (Array.isArray(spot.images)) {
        const spotImages = []
        for (const url of spot.images) {
          const migrated = await migrateUrl(url, cache)
          spotImages.push(migrated)
          if (migrated !== url) changed = true
        }
        spot.images = spotImages
      }
    }
  }

  if (!changed) return false

  await Place.updateOne(
    { _id: place._id },
    {
      $set: {
        heroImage: next.heroImage,
        image: next.image,
        images: next.images,
        spots: next.spots,
      },
    }
  )

  console.log(`Updated DB record: ${place.name} (${place.slug})`)
  return true
}

loadEnv()

if (!process.env.MONGODB_URI) {
  console.error('MONGODB_URI is missing. Add it to .env or .env.local before migrating images.')
  process.exit(1)
}

await mongoose.connect(process.env.MONGODB_URI, {
  dbName: 'sarva',
  bufferCommands: false,
})

const places = await Place.find({
  $or: [
    { heroImage: /wikimedia\.org/i },
    { image: /wikimedia\.org/i },
    { images: /wikimedia\.org/i },
    { 'spots.image': /wikimedia\.org/i },
    { 'spots.images': /wikimedia\.org/i },
  ],
})

const cache = new Map()
let updated = 0

for (const place of places) {
  const changed = await migratePlace(place, cache)
  if (changed) updated += 1
}

console.log(`Places scanned: ${places.length}`)
console.log(`Places updated: ${updated}`)
console.log(`Unique images uploaded: ${cache.size}`)

await mongoose.disconnect()

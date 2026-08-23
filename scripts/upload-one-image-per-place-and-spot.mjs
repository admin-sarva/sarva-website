import fs from 'node:fs'
import mongoose from 'mongoose'
import Place from '../app/models/place.js'
import Note from '../app/models/note.js'

const CLOUDINARY_CLOUD_NAME = 'dlk6lycdy'
const CLOUDINARY_UPLOAD_PRESET = 'sarva_uploads'
const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`
const RUN_ID = 'one-image-v3'

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

function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

const stateByPlace = {
  agumbe: 'Karnataka',
  chikkamagalur: 'Karnataka',
  coonoor: 'Tamil Nadu',
  coorg: 'Karnataka',
  gokarna: 'Karnataka',
  madikeri: 'Karnataka',
  mysore: 'Karnataka',
  ooty: 'Tamil Nadu',
  sakleshpur: 'Karnataka',
  udupi: 'Karnataka',
  wayanad: 'Kerala',
}

const commonsFallbackQueries = [
  'Western Ghats India forest',
  'Karnataka Western Ghats',
  'Kerala Western Ghats',
  'Tamil Nadu Nilgiris landscape',
  'South India temple',
]

const usedCommonsUrls = new Set()

function placeState(place) {
  return stateByPlace[slugify(place.slug || place.name)] || 'India'
}

function commonsApiUrl(params) {
  const url = new URL('https://commons.wikimedia.org/w/api.php')
  url.search = new URLSearchParams({
    format: 'json',
    origin: '*',
    ...params,
  })
  return url
}

async function commonsJson(params) {
  let res

  for (let attempt = 1; attempt <= 6; attempt += 1) {
    res = await fetch(commonsApiUrl(params), {
      headers: {
        'User-Agent': 'SarvaHolidaysImageCuration/1.0 (public image upload to Cloudinary)',
      },
    })

    if (res.ok || res.status !== 429) break
    const waitMs = attempt * 10000
    console.log(`Commons API throttled. Waiting ${waitMs / 1000}s before retry ${attempt + 1}/6.`)
    await new Promise((resolve) => setTimeout(resolve, waitMs))
  }

  if (!res?.ok) throw new Error(`Commons API failed: ${res.status} ${res.statusText}`)
  return res.json()
}

async function searchCommonsFiles(query) {
  const data = await commonsJson({
    action: 'query',
    generator: 'search',
    gsrsearch: `${query} filetype:bitmap`,
    gsrnamespace: '6',
    gsrlimit: '10',
    prop: 'imageinfo',
    iiprop: 'url|mime',
    iiurlwidth: '1800',
  })

  return Object.values(data.query?.pages || {})
    .map((page) => {
      const info = page.imageinfo?.[0]
      return {
        title: page.title,
        url: info?.thumburl || info?.url,
        mime: info?.mime,
      }
    })
    .filter((file) => file.url && file.mime?.startsWith('image/') && !file.mime.includes('svg'))
}

async function sourceFromCommons(queries) {
  for (const query of [...queries, ...commonsFallbackQueries]) {
    const files = await searchCommonsFiles(query)
    const selected = files.find((file) => !usedCommonsUrls.has(file.url)) || files[0]
    if (!selected) continue
    usedCommonsUrls.add(selected.url)
    console.log(`Selected public image: ${selected.title}`)
    return selected.url
  }
  throw new Error(`No Commons image found for ${queries.join(' | ')}`)
}

function placeQueries(place) {
  const state = placeState(place)
  return [
    `${place.name} ${state} India tourism`,
    `${place.name} ${state} India landscape`,
    `${place.name} India`,
  ]
}

function spotQueries(place, spot) {
  const state = placeState(place)
  return [
    `${spot.name} ${place.name} ${state} India`,
    `${spot.name} ${state} India`,
    `${place.name} ${state} India tourism`,
  ]
}

async function uploadToCloudinary(sourceUrl, publicId) {
  return uploadDownloadedImage(sourceUrl, publicId)
}

function filenameFromPublicId(publicId) {
  return `${publicId.split('/').filter(Boolean).join('-')}.jpg`
}

async function uploadDownloadedImage(sourceUrl, publicId) {
  let imageRes

  for (let attempt = 1; attempt <= 5; attempt += 1) {
    imageRes = await fetch(sourceUrl, {
      headers: {
        'User-Agent': 'SarvaHolidaysImageCuration/1.0',
        'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
      },
      redirect: 'follow',
    })

    if (imageRes.ok || imageRes.status !== 429) break
    const waitMs = attempt * 8000
    console.log(`Commons throttled download. Waiting ${waitMs / 1000}s before retry ${attempt + 1}/5.`)
    await new Promise((resolve) => setTimeout(resolve, waitMs))
  }

  if (!imageRes?.ok) {
    throw new Error(`Failed to download ${sourceUrl}: ${imageRes.status} ${imageRes.statusText}`)
  }

  const contentType = imageRes.headers.get('content-type') || 'image/jpeg'
  const blob = new Blob([await imageRes.arrayBuffer()], { type: contentType })
  const form = new FormData()
  form.append('file', blob, filenameFromPublicId(publicId))
  form.append('upload_preset', CLOUDINARY_UPLOAD_PRESET)
  form.append('public_id', publicId)

  const uploadRes = await fetch(CLOUDINARY_UPLOAD_URL, { method: 'POST', body: form })
  const data = await uploadRes.json()

  if (!uploadRes.ok || !data.secure_url) {
    throw new Error(`Cloudinary file upload failed for ${sourceUrl}: ${data.error?.message || uploadRes.statusText}`)
  }

  return data.secure_url
}

loadEnv()
if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI is missing')

await mongoose.connect(process.env.MONGODB_URI, { dbName: 'sarva', bufferCommands: false })

const places = await Place.find({}).sort({ name: 1 })
const placeImageByName = new Map()
let placeUploads = 0
let spotUploads = 0

for (const place of places) {
  const placeSlug = slugify(place.slug || place.name)
  const placeSource = await sourceFromCommons(placeQueries(place))
  const placeImage = await uploadToCloudinary(placeSource, `sarva/places/${placeSlug}/${RUN_ID}/cover`)
  placeUploads += 1
  placeImageByName.set(String(place.name).toLowerCase(), placeImage)

  const spots = Array.isArray(place.spots) ? place.spots : []
  const nextSpots = []

  for (const [index, spot] of spots.entries()) {
    const spotSlug = slugify(spot.name)
    const spotSource = await sourceFromCommons(spotQueries(place, spot))
    const spotImage = await uploadToCloudinary(spotSource, `sarva/places/${placeSlug}/${RUN_ID}/spots/${spotSlug}`)
    spotUploads += 1
    nextSpots.push({
      ...(typeof spot.toObject === 'function' ? spot.toObject() : spot),
      image: spotImage,
      images: [spotImage],
    })
    console.log(`Uploaded spot image: ${place.name} / ${spot.name}`)
  }

  await Place.updateOne(
    { _id: place._id },
    {
      $set: {
        heroImage: placeImage,
        image: placeImage,
        images: [placeImage],
        spots: nextSpots,
      },
    }
  )

  console.log(`Uploaded place image: ${place.name}`)
}

const notes = await Note.find({ status: 'approved' })
let notesUpdated = 0

for (const note of notes) {
  const notePlace = String(note.place || '').toLowerCase()
  const image = placeImageByName.get(notePlace)
  if (!image) continue
  await Note.updateOne({ _id: note._id }, { $set: { image } })
  notesUpdated += 1
}

console.log(`Place uploads: ${placeUploads}`)
console.log(`Spot uploads: ${spotUploads}`)
console.log(`Wander notes pointed to matching place images: ${notesUpdated}`)
console.log(`Total Cloudinary uploads: ${placeUploads + spotUploads}`)

await mongoose.disconnect()
